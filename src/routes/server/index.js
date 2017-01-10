/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Server from './Server';
import fetch from '../../core/fetch';

import customConfig from '../customConfig';

let title = 'Admin Panel';
let description = 'Server admin panel';

export default {

  path: '/server/:anything*',
  auth: true,

  async action({ user, headers }, params) {
    const paramsSplit = params.anything.split('/');
    const serverId = paramsSplit.shift();
    let urlLocation = false;
    if (paramsSplit.length > 0) urlLocation = paramsSplit.join('/');
    if (!user) return { redirect: `/login/server/${serverId}` };

    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (headers) {
      options.headers = headers;
    }

    if (urlLocation) {
      return customConfig.action({ user, headers }, { serverId, urlLocation });
    }

    let prefixResp;
    try {
      prefixResp = await fetch(`/api/v1/prefix/${serverId}`, options);
    } catch (error) {
      console.error('prefix Resp caught', error);
    }

    let prefix;
    if (prefixResp.status === 200) {
      prefix = (await prefixResp.json()).prefix;
    }

    const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);

    if (!guild) return { redirect: `/login/server/${serverId}` };

    title = `${guild.name}'s settings`;
    description = `Admin panel of ${guild.name}`;

    return {
      title,
      description,
      component: <Server title={title} guild={guild} user={user} serverId={serverId} prefix={prefix} />,
    };
  },
};
