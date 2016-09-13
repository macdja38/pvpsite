/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Server.css';
import ServerMenu from '../../components/ServerMenu';
import fetch from '../../core/fetch';

function Server({ user, serverId, prefix }, context) {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
  context.setTitle(guild.name);
  const prefixChange = (event) => {
    fetch(`/api/v1/prefix/${guild.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ prefix: event.target.value }),
    });
  };
  return (
    <div>
      <ServerMenu className={s.nav} user={user} serverId={serverId} />
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>{guild.name}'s Settings</h1>
          {(prefix ? <div>Prefix: <input type="text" name="prefix" defaultValue={prefix} onChange={prefixChange} />
          </div>
            : '')}
        </div>
      </div>
    </div>
  );
}

Server.propTypes = {
  user: PropTypes.object.isRequired,
  serverId: PropTypes.string.isRequired,
  prefix: PropTypes.array,
};

Server.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Server);
