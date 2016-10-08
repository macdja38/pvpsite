import React, { PropTypes } from 'react';

import { SpringGrid, makeResponsive } from 'react-stonecutter';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import cx from 'classnames';

import s from './ServerList.css';

import { oauth } from '../../config';

import Link from '../../components/Link';

const title = 'Server List';

function botOnServer(guild, commonServers) {
  if (commonServers) {
    return !!commonServers.find(g => g.id === guild.id);
  }
  return true;
}

function userManageServer(guild, user) {
  return (user.guilds.find(g => g.id === guild.id).permissions & 32) === 32;
}

function ServerList({ user, commonServers }, context) {
  context.setTitle(title);
  const sortedGuilds = user.guilds.sort((a, b) => {
    if ((a.permissions & 32) !== (b.permissions & 32)) {
      return (b.permissions & 32) - (a.permissions & 32);
    }
    return a.id - b.id;
  });
  const items = sortedGuilds.map((guild, b) => {
    console.log(b, guild.name, guild.permissions);
    const botIsOnServer = botOnServer(guild, commonServers);
    const userHasManageServer = userManageServer(guild, user);
    return (<div
      className={cx(
        s.serverItem,
        (botIsOnServer // eslint-disable-line no-nested-ternary
          ? s.botOnServer :
          (userHasManageServer ? s.botNotOnServer : s.noAddPerms))
      )}
      key={b}
    >
      <Link
        to={botIsOnServer ?
          `/server/${guild.id}` :
          `https://discordapp.com/oauth2/authorize?response_type=code&redirect_uri=${
            oauth.discord.url
          }%2Flogin%2Fdiscord%2Fcallback&scope=identify%20guilds%20bot&client_id=168133784078647296&guild_id=${
            guild.id
          }&permissions=8`}
      >
        <div className={s.serverGuildIconBox}>
          <img
            role="presentation"
            className={s.serverGuildIcon}
            src={guild.icon == null ?
              'https://discordapp.com/api/guilds/97069403178278912/icons/8d7a71e1507514e9ab4345056c8b5cc3.jpg' :
              `https://discordapp.com/api/guilds/${guild.id}/icons/${guild.icon}.jpg`
            }
          />
        </div>
        <div className={s.serverLabel}>
          <h3>{guild.name}</h3>
        </div>
      </Link>
    </div>);
  });

  let Grid = makeResponsive(SpringGrid, {
    maxWidth: 1300,
    defaultColumns: 4,
  });

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>{user.username}'s Servers</h1>
        <Grid
          className="grid"
          component="div"
          columnWidth={212}
          gutterWidth={40}
          gutterHeight={40}
          itemHeight={304}
          springConfig={{ stiffness: 170, damping: 26 }}
        >
          {items}
        </Grid>
      </div>
    </div>
  );
}

ServerList.propTypes = {
  user: PropTypes.object.isRequired,
  commonServers: PropTypes.array,
};

ServerList.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(ServerList);
