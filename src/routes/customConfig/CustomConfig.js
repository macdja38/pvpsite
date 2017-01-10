import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CustomConfig.css';
import ServerMenu from '../../components/ServerMenu';
import CustomServerMenu from '../../components/menuItems/ServerMenu';
import Layout from '../../components/Layout';
import InputBox from '../../components/menuItems/InputBox';

function toDivs(settings, serverId, urlLocation) {
  console.log(settings);
  console.log(urlLocation);
  if (settings.type === 'pageSelector') {
    return (<div key={settings.key}>
      <CustomServerMenu serverId={serverId} pages={Object.keys(settings.children)} page={urlLocation[0]} />
      {toDivs(settings.children[urlLocation[0]])}
    </div>);
  } else if (settings.type === 'category') {
    return <InputBox key={settings.key}><div>{settings.children.map(c => toDivs(c))}</div></InputBox>;
  } else if (settings.type === 'boolean') {
    return (
      <InputBox key={settings.key}>
        <div key={settings.key}>
          {settings.name}
          <input type="checkbox" name={settings.name} alt={settings.description} />
        </div>
      </InputBox>
    );
  } else if (settings.type === 'int') {
    return (
      <InputBox key={settings.key}>
        <div key={settings.key}>
          {settings.name}
          <input type="text" name={settings.name} alt={settings.description} />
        </div>
      </InputBox>
    );
  } else if (settings.type === 'list') {
    return (
      <InputBox key={settings.key}>
        <div key={settings.key}>
          {settings.name}
          <input type="text" name={settings.name} alt={settings.description} />
        </div>
      </InputBox>
    );
  }
  return <div key={settings.key}>{settings.key}</div>;
}

function CustomConfig({ user, serverId, title, guild, settingsMap, urlLocation }) {
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
            {toDivs(settingsMap, serverId, urlLocation.split('/'))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

CustomConfig.propTypes = {
  user: PropTypes.object.isRequired,
  settingsMap: PropTypes.object.isRequired,
  serverId: PropTypes.string.isRequired,
  title: PropTypes.string,
  guild: PropTypes.object,
  urlLocation: PropTypes.string,
};

export default withStyles(s)(CustomConfig);
