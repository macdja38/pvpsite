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
import s from './ServerList.css';

const title = 'Server List';

let iconURL = [`https://discordapp.com/api/guilds/`, `/icons/`, `8d7a71e1507514e9ab4345056c8b5cc3.jpg`];


function ServerList({ user }, context) {
  let avatarURL = `https://discordapp.com/api/users/${user.id}/avatars/${user.avatar}.jpg`;
  context.setTitle(title);

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>{user.username}'s Profile</h1>
        <div className={s.userContainer}>
          <img className={s.userAvatar} src={avatarURL}/>
          <p className={s.userInfo}>User: {user.username}#{user.discriminator}<br/>
          Id: {user.id}<br/>
          2FA: {user.mfa_enabled ? "Enabled" : "Disabled - you may be at risk."}<br/>
          Avatar: {user.avatar}<br/>
          Email: {user.email}</p>
        </div>
        <ul className={s.server}>
          {user.guilds.map((item, index) => (
            <li key={index} className={s.serverItem} style={{listStyleImage:`url('https://discordapp.com/api/guilds/${item.id}/icons/${item.icon}.jpg')`}}>
              <a href={`/server/${item.id}`} className={s.serverTitle}>{item.name}</a>
              <span
                className={s.serverDesc}
                dangerouslySetInnerHTML={{ __html: item.permissions }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ServerList.propTypes = {
  user: PropTypes.object,
};

ServerList.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(ServerList);
