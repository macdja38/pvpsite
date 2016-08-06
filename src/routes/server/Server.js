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
import fetch from '../../core/fetch';

const title = 'React Starter Kit';

function Server({ user, serverId, prefix }, context) {
  console.log(context);
  console.log(user);
  console.log(serverId);
  console.log(prefix);
  let setPrefix = prefix.join(',');
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
  console.log(guild);
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>{guild.name}'s Settings</h1>
        Prefix: <input type="text" name="prefix" value={setPrefix} onChange={(thing) => { fetch(`/api/v1/prefix/${guild.id}`, { method: 'PUT' }); console.log(thing.target); console.log(setPrefix); }} />
        <p>Prefix: {prefix}</p>
      </div>
    </div>
  );
}

Server.propTypes = {
  user: PropTypes.object,
  serverId: PropTypes.string,
  prefix: PropTypes.array,
};

Server.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Server);
