import React, { PropTypes } from 'react';

import { SpringGrid, makeResponsive } from 'react-stonecutter';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './ServerList.css';

const title = 'Server List';

function ServerList({ user }, context) {
  context.setTitle(title);

  const items = user.guilds.map(guild =>
    (
    <div className={s.serverItem} key={guild.id}>
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
        <h3><a href={`/server/${guild.id}`}>{guild.name}</a></h3>
      </div>
    </div>
    )
  );

  let Grid = makeResponsive(SpringGrid, {
    maxWidth: 1000,
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
};

ServerList.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(ServerList);
