import React, { PropTypes } from 'react';
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

function thingOrDefault(settings, defaults, key = 'value') {
  if (settings.hasOwnProperty(key)) return settings[key];
  if (defaults.hasOwnProperty(key)) return defaults[key];
  return true;
  throw new Error('no setting or default value defined');
}

function toDivs(settingsMap, settings, serverId, botId, urlLocation, currentPath) {
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
      {toDivs(settingsMap.children[urlLocation[0]],
        childOrObject(settings, urlLocation[0]),
        serverId,
        botId,
        urlLocation.slice(1),
        currentPath.slice(0).push(settingsMap.key))}
    </div>);
  } else if (settingsMap.type === 'category') {
    return (<InputBox key={settingsMap.key}>
      <div>{
      settingsMap.children.map((c) =>
        toDivs(c,
          childOrObject(settings, c.key),
          serverId,
          botId,
          urlLocation,
          currentPath.slice(0).push(settingsMap.key)))
    }</div>
    </InputBox>);
  } else if (settingsMap.type === 'boolean') {
    console.log(thingOrDefault(settings, settingsMap));
    return (
      <InputBox key={settingsMap.key}>
        <div key={settingsMap.key}>
          {settingsMap.name}
          <input
            type="checkbox"
            name={settingsMap.name}
            alt={settingsMap.description}
            checked={thingOrDefault(settings, settingsMap)}
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
            name={settingsMap.name}
            alt={settingsMap.description}
            value={thingOrDefault(settings, settingsMap)}
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
            name={settingsMap.name}
            alt={settingsMap.description}
            value={thingOrDefault(settings, settingsMap)}
          />
        </div>
      </InputBox>
    );
  }
  return <div key={settingsMap.key}>{settingsMap.key}</div>;
}

function CustomConfig({ user, serverId, settings, botId, title, guild, settingsMap, urlLocation }) {
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
            {toDivs(settingsMap.layout, settings.data, serverId, botId, urlLocation.split('/'))}
          </div>
        </div>
      </div>
    </Layout>
  );
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
