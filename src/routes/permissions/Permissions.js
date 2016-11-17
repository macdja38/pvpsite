import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Permissions.css';
import ServerMenu from '../../components/ServerMenu';
import Layout from '../../components/Layout';
import Selector from '../../components/Selector';
import TextInput from '../../components/TextField';
import fetch from '../../core/fetch';

function buildNode(nodes, value) {
  if (nodes.length === 0) return value;
  const key = nodes.splice(0, 1)[0];
  return { [key]: buildNode(nodes, value) };
}

function recursiveAdd(dataInput, node, value) {
  const data = dataInput;
  let key;
  if (node.length > 0) {
    key = node.shift();
  } else {
    return value;
  }
  if (data && data.hasOwnProperty(key)) {
    const mergedNodes = recursiveAdd(data[key], node, value);
    if (mergedNodes === null || (typeof mergedNodes === 'object' && Object.keys(mergedNodes).length === 0)) {
      delete data[key];
    } else {
      data[key] = mergedNodes;
    }
    return data;
  }
  if (value !== null && data !== null) {
    if (data === true || data === false || typeof data === 'string' || typeof data === 'number') {
      return { [key]: buildNode(node, value) };
    }
    data[key] = buildNode(node, value);
  }
  return data;
}

function generateNode(element, permsArray = []) {
  if (element) {
    if (element.id) {
      if (element.id === 'topLevelPermissionsId') {
        return permsArray;
      }
      permsArray.push(element.id);
    }
    generateNode(element.parentElement, permsArray);
  }
  return permsArray;
}

function toDivs(permissions, serverData, layer = 0) {
  if (typeof permissions !== 'object') {
    return permissions;
  }
  return (<div>{
    Object.keys(permissions).map((key, i) => {
      let label = key;
      let spanClassName;
      // let liClassName;
      const subNode = toDivs(permissions[key], serverData, layer + 1);
      let levelNode;
      switch (layer) {
        case 0:
          levelNode = s.channel;
          if (serverData && serverData.hasOwnProperty('channels') && key !== '*') {
            const channel = serverData.channels.find(c => c.id === key);
            if (channel && channel.hasOwnProperty('name')) {
              label = `Channel: #${channel.name}`;
            }
          } else if (key === '*') {
            label = 'All Channels';
          }
          break;
        case 1:
          if (key[0] === 'u') {
            levelNode = s.user;
            if (serverData && serverData.hasOwnProperty('members')) {
              const userId = key.slice(1);
              const user = serverData.members.find(m => m.id === userId);
              if (user && user.hasOwnProperty('name')) {
                label = `User: ${user.name}`;
              }
            }
          } else if (key[0] === 'g') {
            levelNode = s.group;
            if (serverData && serverData.hasOwnProperty('roles')) {
              const groupId = key.slice(1);
              const group = serverData.roles.find(g => g.id === groupId);
              if (group && group.hasOwnProperty('name')) {
                label = `Role: ${group.name}`;
              }
            }
          } else if (key === '*') {
            levelNode = s.allGroupsAndUsers;
            label = 'All Roles/Users';
          }
          break;
        case 2:
          levelNode = cx(s.nodeStart, s.node);
          break;
        default:
          levelNode = s.node;
      }
      if (typeof subNode === 'boolean') {
        spanClassName = (subNode === true) ? s.allowed : s.denied;
        // liClassName = s.permissions;
      } else {
        spanClassName = s.entry;
        // liClassName = s.permissionItem;
      }
      return (<div className={cx(spanClassName, levelNode)} key={i} id={key}>{label}{subNode}</div>);
    })
  }</div>);
}

class Permissions extends Component {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  static propTypes = {
    user: PropTypes.object.isRequired,
    serverId: PropTypes.string,
    serverData: PropTypes.object,
    permissions: PropTypes.object,
    title: PropTypes.string,
    guild: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.allowClicked = this.allowClicked.bind(this);
    this.denyClicked = this.denyClicked.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.channelCallback = this.channelCallback.bind(this);
    this.userAndGroupCallback = this.userAndGroupCallback.bind(this);
    this.nodeCallback = this.nodeCallback.bind(this);
    this.editClicked = this.editClicked.bind(this);
    this.state = { edit: false, applyEnabled: false };

    this.state.canEdit = props.guild.owner || (props.guild.permissions & 8) === 8; // eslint-disable-line no-bitwise
  }

  channelCallback(channel) {
    this.targetChannel = channel;
  }

  userAndGroupCallback(user) {
    this.targetUserOrGroup = user;
  }

  nodeCallback(node) {
    this.targetNode = node;
    if (this.state.applyEnabled && node === '') {
      this.setState({ applyEnabled: false });
    } else if (!this.state.applyEnabled && node !== '') {
      this.setState({ applyEnabled: true });
    }
  }

  removeHandler(proxy, nd, reactClick) {
    if (!this.state.edit) return;
    let targetNode;
    if (reactClick) {
      targetNode = reactClick.explicitOriginalTarget;
    } else {
      targetNode = proxy.target;
    }
    targetNode = generateNode(targetNode).reverse();
    this.applyPermissionsChange(targetNode, null);
  }

  allowClicked(event) {
    if (!this.state.edit || !this.state.applyEnabled) return;
    const channel = this.targetChannel.id;
    const userOrGroup = this.targetUserOrGroup.id === '*' ? '*' :
      ((this.targetUserOrGroup.r ? 'g' : 'u') + this.targetUserOrGroup.id);
    const nodeText = this.targetNode;
    const node = [channel, userOrGroup];
    node.push(...nodeText.toLowerCase().split('.'));
    this.applyPermissionsChange(node, true);
    event.preventDefault();
  }

  denyClicked(event) {
    if (!this.state.edit || !this.state.applyEnabled) return;
    const channel = this.targetChannel.id;
    const userOrGroup = this.targetUserOrGroup.id === '*' ? '*' :
      ((this.targetUserOrGroup.r ? 'g' : 'u') + this.targetUserOrGroup.id);
    const nodeText = this.targetNode;
    const node = [channel, userOrGroup];
    node.push(...nodeText.toLowerCase().split('.'));
    this.applyPermissionsChange(node, false);
    event.preventDefault();
  }

  applyPermissionsChange(targetNode, value) {
    let server = this.state.permissions.server;
    server = recursiveAdd(server, targetNode.map(n => n.replace(/\u200B/g, '')), value);
    fetch(`/api/v1/permissions/${server.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(server),
    }).then((...args) => {
      this.setState({ permissions: { server } });
      console.log(...args);
    }).catch(error => {
      console.log(error);
      alert(error.toString());
    });
  }

  editClicked(event) {
    this.setState({ edit: !this.state.edit });
    event.preventDefault();
  }

  render() {
    const { user, serverId, permissions, serverData, title } = this.props;

    if (!this.state) {
      this.state = {};
    }

    if (!this.state.permissions) {
      this.state.permissions = permissions;
    }

    const items = toDivs(this.state.permissions.server, serverData);
    if (serverData.channels && serverData.roles && serverData.members) {
      const channels = [{ id: '*', name: 'All' }];
      channels.push(...serverData.channels.map(c => ({ id: c.id, name: c.type === 0 ? `# ${c.name}` : c.name })));

      const userChoices = [{ id: '*', name: 'All' }];
      userChoices.push(
        ...(serverData.roles || [])
          .map(r => {
            r.r = true; // eslint-disable-line no-param-reassign
            return r;
          })
      );
      userChoices.push(...serverData.members);

      this.channelSelector = (
        <Selector
          placeHolder="channels" label={'Channels'} callback={this.channelCallback} items={channels}
        />);
      this.userAndGroupSelector = (
        <Selector
          placeHolder="groups/users" label={'Users/Roles'} callback={this.userAndGroupCallback} items={userChoices}
        />);
      this.nodeText = (
        <TextInput
          placeHolder="Permission node" callback={this.nodeCallback}
        />);
    }

    return (
      <Layout user={user} >
        <div>
          <ServerMenu className={s.nav} user={user} serverId={serverId} page="permissions" />
          <div className={s.container}>
            <h1 className={s.title}>{title}</h1>
            <div className={s.root}>
              {this.state.canEdit && <div>
                <div style={{ float: 'left', visibility: this.state.edit ? false : 'hidden' }}>
                  {this.channelSelector}
                  {this.userAndGroupSelector}
                  {this.nodeText}
                  <button
                    alt="Enter a permission node first"
                    className={
                      cx(s.button, s.buttonAllowed, this.state.edit && this.state.applyEnabled ? '' :
                        cx(s.buttonDisabled, s.hoverText)
                      )
                    }
                    onClick={this.allowClicked}
                  >
                    Allow
                  </button>
                  <button
                    alt="Enter a permission node first"
                    className={
                      cx(s.button, s.buttonDenied, this.state.edit && this.state.applyEnabled ? '' :
                        cx(s.buttonDisabled, s.hoverText)
                      )
                    }
                    onClick={this.denyClicked}
                  >
                    Deny
                  </button>
                </div>
                <button
                  className={cx(s.button, this.state.edit ? s.editEnabled : s.editDisabled)}
                  onClick={this.editClicked}
                >
                Edit
                </button>
                <div className={s.clearFix} />
                <p style={{ visibility: this.state.edit ? false : 'hidden' }}>
                Click a Node to delete it (feature still in beta, refresh page before use). For a complete list of nodes
                visit the documentation page.
                </p>
              </div>
              }
              {
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              }<div
                style={{ cursor: this.state.edit ? 'pointer' : false }}
                onClick={this.removeHandler}
                id="topLevelPermissionsId"
              >
                {items}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default withStyles(s)(Permissions);
