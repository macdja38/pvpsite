import React, { PropTypes, Component } from 'react';
import deepmerge from 'deepmerge';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CustomConfig.css';
import ServerMenu from '../../components/ServerMenu';
import CustomServerMenu from '../../components/menuItems/ServerMenu';
import Layout from '../../components/Layout';
import InputBox from '../../components/menuItems/InputBox';
import fetch from '../../core/fetch';

function childOrObject(item, key) {
  if (item.hasOwnProperty(key)) return item[key];
  return {};
}

function buildNode(nodes, value) {
  if (nodes.length === 0) return value;
  const key = nodes.shift();
  return { [key]: buildNode(nodes, value) };
}

function thingOrDefault(delta, settings, defaults, key = 'value') {
  if (delta.hasOwnProperty(key)) return delta[key];
  if (settings.hasOwnProperty(key)) return settings[key];
  if (defaults.hasOwnProperty(key)) return defaults[key];
  throw new Error('no setting or default value defined');
}

function duplicateAndPush(array, ...params) {
  const newArray = array.slice(0);
  newArray.push(...params);
  return newArray;
}

class CustomConfig extends Component {
  constructor(props) {
    super(props);
    this.state = { settings: (props.settings || { data: {} }).data, delta: {} };
    this.serverId = props.serverId;
    this.botId = props.botId;

    this.toDivs = this.toDivs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(key, currentDelta, settings, settingsMap) {
    return (event) => {
      console.log(key);
      let value;
      const itemValue = event.target.value;
      if (settingsMap.type === 'boolean') {
        value = !thingOrDefault(currentDelta, settings, settingsMap);
      } else if (settingsMap.type === 'number') {
        value = parseFloat(itemValue);
      } else if (settingsMap.type === 'text') {
        value = event.target.value;
      }
      console.log(event.target.value, value);
      const newValue = buildNode(key, { value });
      console.log(newValue);
      console.log(JSON.stringify(newValue));
      const delta = deepmerge(this.state.delta, newValue);
      console.log(delta);
      this.setState({ delta });
      console.log(this.state);
    };
  }

  handleSubmit(event) {
    console.log(this);
    fetch(`/api/v1/settings/bot/${this.botId}/guild/${this.serverId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ data: this.state.delta }),
    }).then(() => {
      alert('Job Done!');
    });
    event.preventDefault();
  }

  toDivs(settingsMap, settings, delta, serverId, botId, urlLocation, currentPath) {
    console.log('and another one');
    console.log(settingsMap);
    console.log(settings);
    console.log(delta);
    if (settingsMap.type === 'pageSelector') {
      return (<div key={settingsMap.key}>
        <CustomServerMenu
          botId={botId}
          serverId={serverId}
          pages={Object.keys(settingsMap.children)}
          page={urlLocation[0]}
        />
        {this.toDivs(settingsMap.children[urlLocation[0]],
          childOrObject(settings, urlLocation[0]),
          childOrObject(delta, urlLocation[0]),
          serverId,
          botId,
          urlLocation.slice(1),
          duplicateAndPush(currentPath, urlLocation[0]))}
      </div>);
    } else if (settingsMap.type === 'category') {
      return (<InputBox key={settingsMap.key}>
        <div>{
          Object.keys(settingsMap.children).map((key) =>
            this.toDivs(settingsMap.children[key],
              childOrObject(settings, key),
              childOrObject(delta, key),
              serverId,
              botId,
              urlLocation,
              duplicateAndPush(currentPath, key)))
        }</div>
      </InputBox>);
    } else if (settingsMap.type === 'boolean') {
      return (
        <InputBox key={settingsMap.key}>
          <div key={settingsMap.key}>
            {settingsMap.name}
            <input
              className={s.check}
              type="checkbox"
              onChange={this.handleChange(currentPath, delta, settings, settingsMap)}
              name={settingsMap.name}
              title={settingsMap.description}
              checked={thingOrDefault(delta, settings, settingsMap)}
            />
          </div>
        </InputBox>
      );
    } else if (settingsMap.type === 'number') {
      return (
        <InputBox key={settingsMap.key}>
          <div key={settingsMap.key}>
            {settingsMap.name}
            <input
              className={s.number}
              type="number"
              onChange={this.handleChange(currentPath, delta, settings, settingsMap)}
              name={settingsMap.name}
              title={settingsMap.description}
              value={thingOrDefault(delta, settings, settingsMap)}
            />
          </div>
        </InputBox>
      );
    } else if (settingsMap.type === 'text') {
      return (
        <InputBox key={settingsMap.key}>
          <div key={settingsMap.key}>
            {settingsMap.name}
            <input
              className={s.text}
              type="text"
              onChange={this.handleChange(currentPath, delta, settings, settingsMap)}
              name={settingsMap.name}
              title={settingsMap.description}
              value={thingOrDefault(delta, settings, settingsMap)}
            />
          </div>
        </InputBox>
      );
    }
    return <div key={settingsMap.key}>{settingsMap.key}</div>;
  }

  render() {
    const { user, serverId, botId, title, guild, settingsMap, urlLocation } = this.props;
    // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
    if (!guild) {
      return (<div><h2>Guild {serverId} Not Found</h2>Your Guild Could not be found</div>);
    }
    return (
      <Layout user={user}>
        <div>
          <ServerMenu className={s.nav} user={user} serverId={serverId} page="server" />
          <div className={s.root}>
            <div className={s.container}>
              <h1 className={s.title}>{title} changed</h1>
              <form onSubmit={this.handleSubmit}>
                {this.toDivs(settingsMap.layout,
                  this.state.settings,
                  this.state.delta,
                  serverId,
                  botId,
                  urlLocation.split('/'),
                  [])}
                <input className={s.save} type="submit" value="Save" name="save" />
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

CustomConfig.propTypes = {
  user: PropTypes.object.isRequired,
  settingsMap: PropTypes.object.isRequired,
  settings: PropTypes.object,
  botId: PropTypes.string.isRequired,
  serverId: PropTypes.string.isRequired,
  title: PropTypes.string,
  guild: PropTypes.object,
  urlLocation: PropTypes.string.isRequired,
};

export default withStyles(s)(CustomConfig);
