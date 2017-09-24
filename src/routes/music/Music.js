/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Music.css';
import ServerMenu from '../../components/ServerMenu';
import Layout from '../../components/Layout';

function Music({ user, serverId, music, title }) {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  let items;
  try {
    items = music.queue.map((song, position) =>
      <tr key={position}>
        <td>{position}</td>
        <td>{song.title}</td>
        <td>{song.author ? song.author.name : ''}</td>
        <td>{song.lengthSeconds}</td>
        <td>{song.user_name}</td>
      </tr>,
    );
  } catch (error) {
    items = [];
    console.error(error);
  }
  return (
    <Layout user={user}>
      <div>
        <ServerMenu className={s.nav} user={user} serverId={serverId} page="music" />
        <div className={s.root}>
          <div className={s.container}>
            <h1 className={s.title}>{title}</h1>
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
    </Layout>
  );
}

Music.propTypes = {
  user: PropTypes.object.isRequired,
  serverId: PropTypes.string.isRequired,
  music: PropTypes.object,
  title: PropTypes.string,
};

export default withStyles(s)(Music);
