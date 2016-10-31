/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import ServerList from './ServerList';
import fetch from '../../core/fetch';

let title = 'Server List';
const description = 'Server List Page';

export default {

  path: '/server/',
  auth: true,

  async action({ user, headers }) {
    if (!user) {
      return { redirect: '/login/server/' };
    }

    // console.log('Making request'); // eslint-disable-line no-console
    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (headers) {
      options.headers = headers;
    }

    let commonServersResp;
    try {
      commonServersResp = await fetch('/api/v1/servers/', options);
    } catch (error) {
      console.error('commonServers Resp caught', error);
    }

    let commonServers;
    if (commonServersResp.status === 200) {
      commonServers = await commonServersResp.json();
    } else {
      console.error(commonServersResp);
    }

    title = `${user.username}'s Servers`;

    return {
      title,
      description,
      component: <ServerList title={title} user={user} commonServers={commonServers} />,
    };
  },

};
