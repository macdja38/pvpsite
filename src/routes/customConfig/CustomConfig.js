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
import s from './CustomConfig.css';
import ServerMenu from '../../components/ServerMenu';
import PrefixField from '../../components/PrefixField';
import Layout from '../../components/Layout';

function toDivs(settingsMap) {
  console.log(settingsMap);
  return (<div>{
    settingsMap.map(setting => {
      if (setting.type === 'category') {
        return toDivs(setting.children);
      } else if (setting.type === 'boolean') {
        return <div><input type="checkbox" /></div>;
      }
      return <div />;
    })
  }</div>);
}

function CustomConfig({ user, serverId, prefix, title, guild, settingsMap }) {
  console.log(settingsMap.layout);
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
            <h1 className={s.title}>{title} changed</h1>
            {(prefix ? <div>Prefix: <PrefixField
              serverId={serverId}
              prefix={prefix}
            />
            </div>
              : '')}
            {toDivs(settingsMap.layout)}
          </div>
        </div>
      </div>
    </Layout>
  );
}

CustomConfig.propTypes = {
  user: PropTypes.object.isRequired,
  settingsMap: PropTypes.object.isRequired,
  serverId: PropTypes.string.isRequired,
  prefix: PropTypes.array,
  title: PropTypes.string,
  guild: PropTypes.object,
};

export default withStyles(s)(CustomConfig);
