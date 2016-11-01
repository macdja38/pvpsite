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
              label = `#${channel.name}`;
            }
          }
          break;
        case 1:
          if (key[0] === 'u') {
            levelNode = s.user;
            if (serverData && serverData.hasOwnProperty('members') && key !== '*') {
              const userId = key.slice(1);
              const user = serverData.members.find(m => m.id === userId);
              if (user && user.hasOwnProperty('name')) {
                label = `User: ${user.name}`;
              }
            }
          } else {
            levelNode = s.group;
            if (serverData && serverData.hasOwnProperty('roles') && key !== '*') {
              const groupId = key.slice(1);
              const group = serverData.roles.find(g => g.id === groupId);
              if (group && group.hasOwnProperty('name')) {
                label = `Role: ${group.name}`;
              }
            }
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
    user: PropTypes.object,
    serverId: PropTypes.string,
    serverData: PropTypes.object,
    permissions: PropTypes.object,
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.allowClicked = this.allowClicked.bind(this);
    this.denyClicked = this.denyClicked.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.channelCallback = this.channelCallback.bind(this);
    this.userAndGroupCallback = this.userAndGroupCallback.bind(this);
    this.nodeCallback = this.nodeCallback.bind(this);
  }

  channelCallback(channel) {
    this.targetChannel = channel;
  }

  userAndGroupCallback(user) {
    this.targetUserOrGroup = user;
  }

  nodeCallback(node) {
    this.targetNode = node;
  }

  removeHandler(proxy, nd, reactClick) {
    let targetNode;
    if (reactClick) {
      targetNode = reactClick.explicitOriginalTarget;
    } else {
      targetNode = proxy.target;
    }
    targetNode = generateNode(targetNode).reverse();
    this.applyPermissionsChange(targetNode, null);
  }

  allowClicked() {
    const channel = this.targetChannel.id;
    const userOrGroup = this.targetUserOrGroup.id === '*' ? '*' :
      ((this.targetUserOrGroup.r ? 'g' : 'u') + this.targetUserOrGroup.id);
    const nodeText = this.targetNode;
    const node = [channel, userOrGroup];
    node.push(...nodeText.toLowerCase().split('.'));
    this.applyPermissionsChange(node, true);
  }

  denyClicked() {
    const channel = this.targetChannel.id;
    const userOrGroup = this.targetUserOrGroup.id === '*' ? '*' :
      ((this.targetUserOrGroup.r ? 'g' : 'u') + this.targetUserOrGroup.id);
    const nodeText = this.targetNode;
    const node = [channel, userOrGroup];
    node.push(...nodeText.toLowerCase().split('.'));
    this.applyPermissionsChange(node, true);
  }

  applyPermissionsChange(targetNode, value) {
    let server = this.state.permissions.server;
    server = recursiveAdd(server, targetNode, value);
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
      channels.push(...serverData.channels.map(c => ({ id: c.id, name: c.type === 0 ? `#${c.name}` : c.name })));

      const userChoices = [{ id: '*', name: 'All' }];
      userChoices.push(
        ...(serverData.roles || [])
          .map(r => {
            r.r = true; // eslint-disable-line no-param-reassign
            return r;
          })
      );
      userChoices.push(...serverData.members);

      this.channelSelector = <Selector callback={this.channelCallback} items={channels} />;
      this.userAndGroupSelector = <Selector callback={this.userAndGroupCallback} items={userChoices} />;
      this.nodeText = <TextInput callback={this.nodeCallback} />;
    }

    return (
      <Layout user={user} >
        <div>
          <ServerMenu className={s.nav} user={user} serverId={serverId} page="permissions" />
          <div className={s.container}>
            <h1 className={s.title}>{title}</h1>
            {this.channelSelector}
            {this.userAndGroupSelector}
            {this.nodeText}
            <button className={cx(s.button, s.buttonAllowed)} onClick={this.allowClicked} >Allow</button>
            <button className={cx(s.button, s.buttonDenied)} onClick={this.denyClicked} >Deny</button>
            <div className={s.root}>
              <p>Click a Node to delete it (feature still in beta, refresh page before use).</p>{
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              }<div onClick={this.removeHandler} id="topLevelPermissionsId">
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
