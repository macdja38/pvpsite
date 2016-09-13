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
import s from './Permissions.css';
import ServerMenu from '../../components/ServerMenu';

function Permissions({ user, serverId, prefix }, context) {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
  context.setTitle(guild.name);
  return (
    <div>
      <ServerMenu className={s.nav} user={user} serverId={serverId} />
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>{guild.name}'s Permissions</h1>
        </div>
      </div>
    </div>
  );
}

Permissions.propTypes = {
  user: PropTypes.object,
  serverId: PropTypes.string,
  prefix: PropTypes.array,
};

Permissions.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Permissions);
