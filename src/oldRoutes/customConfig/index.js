/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import CustomConfig from './CustomConfig';
import fetch from '../../core/fetch';

let title = 'Admin Panel';
let description = 'Server admin panel';

export default {

  path: '/bot/:botId/server/:serverId/:urlLocation*',
  auth: true,

  async action({ user, headers }, params) {
    /* const paramsSplit = params.anything.split('/');
     const serverId = paramsSplit.shift();
     let urlLocation = false;
     if (paramsSplit.length > 0) urlLocation = paramsSplit.join('/');
     */
    console.log(params);
    if (!user) return { redirect: `/login/server/${params.serverId}` };

    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (headers) {
      options.headers = headers;
    }

    let settingsResp;
    try {
      settingsResp = await fetch(`/api/v1/settings/bot/${params.botId}/guild/${params.serverId}`, options);
    } catch (error) {
      return { redirect: `/login/server/${params.serverId}/${params.urlLocation}` };
    }

    let settingsMapResp;
    try {
      settingsMapResp = await fetch(`/api/v1/settingsMap/bot/${params.botId}/guild/${params.serverId}`, options);
    } catch (error) {
      return { redirect: `/login/server/${params.serverId}/${params.urlLocation}` };
    }

    let settings;
    if (settingsResp.status === 200) {
      settings = (await settingsResp.json());
    } else {
      settings = {};
    }

    let settingsMap;
    if (settingsMapResp.status === 200) {
      settingsMap = (await settingsMapResp.json());
    } else {
      settingsMap = {};
    }

    const guild = user.guilds.find(serverGuild => params.serverId === serverGuild.id);

    if (!guild) return { redirect: `/login/server/${params.serverId}` };

    title = `${guild.name}'s settings`;
    description = `Admin panel of ${guild.name}`;

    return {
      title,
      description,
      component: <CustomConfig
        title={title}
        guild={guild}
        user={user}
        botId={params.botId}
        serverId={params.serverId}
        urlLocation={params.urlLocation}
        settings={settings}
        settingsMap={settingsMap}
      />,
    };
  },
};
