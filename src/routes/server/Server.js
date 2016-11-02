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
import PrefixField from '../../components/PrefixField';
import Layout from '../../components/Layout';

function Server({ user, serverId, prefix, title, guild }) {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  if (!guild) {
    return (<div><h2>Guild {serverId} Not Found</h2>Your Guild Could not be found</div>);
  }
  return (
    <Layout user={user}>
      <div>
        <ServerMenu className={s.nav} user={user} serverId={serverId} page="server" />
        <div className={s.root}>
          <div className={s.container}>
            <h1 className={s.title}>{title}</h1>
            {(prefix ? <div>Prefix: <PrefixField
              serverId={serverId}
              prefix={prefix}
            />
            </div>
              : '')}
          </div>
        </div>
      </div>
    </Layout>
  );
}

Server.propTypes = {
  user: PropTypes.object.isRequired,
  serverId: PropTypes.string.isRequired,
  prefix: PropTypes.array,
  title: PropTypes.string,
  guild: PropTypes.object,
};

export default withStyles(s)(Server);
