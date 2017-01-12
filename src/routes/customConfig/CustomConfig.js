import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CustomConfig.css';
import ServerMenu from '../../components/ServerMenu';
import CustomServerMenu from '../../components/menuItems/ServerMenu';
import Layout from '../../components/Layout';
import InputBox from '../../components/menuItems/InputBox';

function childOrObject(item, key) {
  if (item.hasOwnProperty(key)) return item[key];
  return {};
}

function thingOrDefault(delta, settings, defaults, key = 'value') {
  if (delta.hasOwnProperty(key)) return delta[key];
  if (settings.hasOwnProperty(key)) return settings[key];
  if (defaults.hasOwnProperty(key)) return defaults[key];
  return true;
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
    this.state = { settings: props.settings.data, delta: {} };

    this.toDivs = this.toDivs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(key) {
    return (event) => {
      console.log(key);
      console.log(event.target.value);
      this.state[key] = event.target.value;
    };
  }

  handleSubmit() {
    console.log(this);
  }

  toDivs(settingsMap, settings, delta, serverId, botId, urlLocation, currentPath) {
    console.log('Iteration', urlLocation);
    console.log('settings:', settings);
    console.log('settingsMap:', settingsMap);
    console.log('urlLocation:', urlLocation);
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
          duplicateAndPush(currentPath, settingsMap.key))}
      </div>);
    } else if (settingsMap.type === 'category') {
      return (<InputBox key={settingsMap.key}>
        <div>{
          settingsMap.children.map((c) =>
            this.toDivs(c,
              childOrObject(settings, c.key),
              childOrObject(delta, c.key),
              serverId,
              botId,
              urlLocation,
              duplicateAndPush(currentPath, settingsMap.key)))
        }</div>
      </InputBox>);
    } else if (settingsMap.type === 'boolean') {
      console.log(thingOrDefault(delta, settings, settingsMap));
      return (
        <InputBox key={settingsMap.key}>
          <div key={settingsMap.key}>
            {settingsMap.name}
            <input
              type="checkbox"
              onChange={this.handleChange(duplicateAndPush(currentPath, settingsMap.key))}
              name={settingsMap.name}
              alt={settingsMap.description}
              checked={thingOrDefault(delta, settings, settingsMap)}
            />
          </div>
        </InputBox>
      );
    } else if (settingsMap.type === 'int') {
      return (
        <InputBox key={settingsMap.key}>
          <div key={settingsMap.key}>
            {settingsMap.name}
            <input
              type="text"
              onChange={this.handleChange(duplicateAndPush(currentPath, settingsMap.key))}
              name={settingsMap.name}
              alt={settingsMap.description}
              value={thingOrDefault(delta, settings, settingsMap)}
            />
          </div>
        </InputBox>
      );
    } else if (settingsMap.type === 'list') {
      return (
        <InputBox key={settingsMap.key}>
          <div key={settingsMap.key}>
            {settingsMap.name}
            <input
              type="text"
              onChange={this.handleChange(duplicateAndPush(currentPath, settingsMap.key))}
              name={settingsMap.name}
              alt={settingsMap.description}
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
              {this.toDivs(settingsMap.layout,
                this.state.settings,
                this.state.delta,
                serverId,
                botId,
                urlLocation.split('/'),
                [])}
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
  urlLocation: PropTypes.string,
};

export default withStyles(s)(CustomConfig);
