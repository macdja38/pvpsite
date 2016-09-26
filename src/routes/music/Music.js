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
import s from './Music.css';
import ServerMenu from '../../components/ServerMenu';

function Music({ user, serverId, music }, context) {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  try {
    const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
    context.setTitle(guild.name);
    context.setDescription(`Queued music for ${guild.name}`);
    const items = music.queue.map((song, position) =>
      <tr key={position}>
        <td>{position}</td>
        <td>{song.title}</td>
        <td>{song.author}</td>
        <td>{song.lengthSeconds}</td>
        <td>{song.user.name}</td>
      </tr>
    );
    return (
      <div>
        <ServerMenu className={s.nav} user={user} serverId={serverId} page="music" />
        <div className={s.root}>
          <div className={s.container}>
            <h1 className={s.title}>{guild.name}'s Music</h1>
            <table>
              <tbody>
                <tr>
                  <th>#</th>
                  <th>Song</th>
                  <th>Uploader</th>
                  <th>Duration</th>
                  <th>Added by</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) { console.error(error); }
}

Music.propTypes = {
  user: PropTypes.object.isRequired,
  serverId: PropTypes.string.isRequired,
  music: PropTypes.object,
};

Music.contextTypes = { setTitle: PropTypes.func.isRequired, setDescription: PropTypes.func.isRequired };

export default withStyles(s)(Music);
