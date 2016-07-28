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

const title = 'React Starter Kit';

let iconURL = [`https://discordapp.com/api/guilds/`, `/icons/`, `8d7a71e1507514e9ab4345056c8b5cc3.jpg`];


function Server({ user, server_id }, context) {
  let avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  let guild = user.guilds.find(guild => server_id === guild.id);
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>{guild.name}'s Settings</h1>
      </div>
    </div>
  );
}

Server.propTypes = {
  user: PropTypes.object,
  server_id: PropTypes.string,
};

Server.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Server);
