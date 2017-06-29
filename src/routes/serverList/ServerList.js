import React from 'react';
import PropTypes from 'prop-types';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import cx from 'classnames';

import s from './ServerList.css';

import { oauth } from '../../client.config';

import Link from '../../components/Link';

import Layout from '../../components/Layout';

/* function botOnServer(guild, commonServers) {
  if (commonServers) {
    return !!commonServers.find(g => g.id === guild.id);
  }
  return true;
}*/

/* function userManageServer(guild, user) {
  return (user.guilds.find(g => g.id === guild.id).permissions & 32) === 32; // eslint-disable-line no-bitwise
}*/

function ServerList({ user, /* commonServers,*/ title }) {
  const sortedGuilds = user.guilds.sort((a, b) => {
    if ((a.permissions & 32) !== (b.permissions & 32)) { // eslint-disable-line no-bitwise
      return (b.permissions & 32) - (a.permissions & 32); // eslint-disable-line no-bitwise
    }
    return a.id - b.id;
  });
  const items = sortedGuilds.map((guild) => {
    // const botIsOnServer = botOnServer(guild, commonServers);
    // const userHasManageServer = userManageServer(guild, user);
    return (<div
      className={cx(
        s.serverItem,
        /* (botIsOnServer // eslint-disable-line no-nested-ternary
          ? s.botOnServer :
          (userHasManageServer ? s.botNotOnServer : s.noAddPerms))*/
        s.botOnServer,
      )}
      key={guild.id}
    >
      <Link
        to={/* || botIsOnServer ?*/
          `/server/${guild.id}`
          /* : `https://discordapp.com/oauth2/authorize?response_type=code&redirect_uri=${
            oauth.discord.url
          }%2Flogin%2Fdiscord%2Fcallback&scope=identify%20guilds%20bot&client_id=168133784078647296&guild_id=${
            guild.id
          }&permissions=8`*/}
      >
        <div className={s.serverGuildIconBox}>
          {guild.icon != null ? <img
            alt=""
            className={s.serverGuildIcon}
            src={`https://discordapp.com/api/guilds/${guild.id}/icons/${guild.icon}.jpg`}
          /> : ''}
        </div>
        <div className={s.serverLabel}>
          <h3>{guild.name}</h3>
        </div>
      </Link>
    </div>);
  });

  return (
    <Layout user={user}>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>{title}</h1>
          <div
            className={s.grid}
          >
            {items}
          </div>
        </div>
      </div>
    </Layout>
  );
}

ServerList.propTypes = {
  user: PropTypes.object.isRequired,
//  commonServers: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(s)(ServerList);
