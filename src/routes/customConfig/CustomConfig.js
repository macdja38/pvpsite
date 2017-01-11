import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CustomConfig.css';
import ServerMenu from '../../components/ServerMenu';
import CustomServerMenu from '../../components/menuItems/ServerMenu';
import Layout from '../../components/Layout';
import InputBox from '../../components/menuItems/InputBox';

function toDivs(settingsMap, settings, serverId, botId, urlLocation) {
  console.log(settingsMap);
  console.log(urlLocation);
  if (settingsMap.type === 'pageSelector') {
    return (<div key={settingsMap.key}>
      <CustomServerMenu
        botId={botId}
        serverId={serverId}
        pages={Object.keys(settingsMap.children)}
        page={urlLocation[0]}
      />
      {toDivs(settingsMap.children[urlLocation[0]], serverId, botId, urlLocation.slice(1))}
    </div>);
  } else if (settingsMap.type === 'category') {
    return (<InputBox key={settingsMap.key}>
      <div>{settingsMap.children.map(c => toDivs(c, serverId, botId, urlLocation.slice(1)))}</div>
    </InputBox>);
  } else if (settingsMap.type === 'boolean') {
    return (
      <InputBox key={settingsMap.key}>
        <div key={settingsMap.key}>
          {settingsMap.name}
          <input type="checkbox" name={settingsMap.name} alt={settingsMap.description} />
        </div>
      </InputBox>
    );
  } else if (settingsMap.type === 'int') {
    return (
      <InputBox key={settingsMap.key}>
        <div key={settingsMap.key}>
          {settingsMap.name}
          <input type="text" name={settingsMap.name} alt={settingsMap.description} />
        </div>
      </InputBox>
    );
  } else if (settingsMap.type === 'list') {
    return (
      <InputBox key={settingsMap.key}>
        <div key={settingsMap.key}>
          {settingsMap.name}
          <input type="text" name={settingsMap.name} alt={settingsMap.description} />
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
