/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Permissions from './Permissions';
import fetch from '../../core/fetch';
import { oauth } from '../../client.config.js';

let title = 'Permissions Page';
let description = 'Permissions webadmin pannel';

export default {

  path: '/server/:serverId/permissions',
  auth: true,

  async action({ user, headers }, params) {
    if (!user) return { redirect: `/login/server/${params.serverId}/permissions` };

    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (headers) {
      options.headers = headers;
    }

    const permissionsResp = await fetch(`/api/v1/permissions/${params.serverId}`, options);
    const serverDataResp = await fetch(`/api/v1/server/${params.serverId}`, options);

    let serverData;
    if (serverDataResp.status === 200) {
      console.log(serverDataResp);
      serverData = await serverDataResp.json();
      console.log(serverData);
    } else {
      if (window) {
        window.location = `https://discordapp.com/oauth2/authorize?response_type=code&redirect_uri=${
          oauth.discord.url
          }%2Flogin%2Fdiscord%2Fcallback&scope=identify%20guilds%20bot&client_id=168133784078647296&guild_id=${
          params.serverId
          }&permissions=8`;
      } else {
        return {
          redirect: `https://discordapp.com/oauth2/authorize?response_type=code&redirect_uri=${
            oauth.discord.url
            }%2Flogin%2Fdiscord%2Fcallback&scope=identify%20guilds%20bot&client_id=168133784078647296&guild_id=${
            params.serverId
            }&permissions=8`,
        };
      }
    }

    let permissions;
    if (permissionsResp.status === 200) {
      permissions = (await permissionsResp.json());
    }

    console.log(permissions);
    if (!permissions) return { redirect: `/login/server/${params.serverId}/permissions` };
    if (!user) return { redirect: `/login/server/${params.serverId}/permissions` };
    if (!serverData) return { redirect: `/login/server/${params.serverId}/permissions` };

    const guild = user.guilds.find(serverGuild => params.serverId === serverGuild.id);

    if (!guild) return { redirect: `/login/server/${params.serverId}/permissions` };

    title = `${guild.name}'s Permissions`;
    description = `${guild.name}'s Permissions Control panel`;

    return {
      title,
      description,
      component: <Permissions
        guild={guild}
        user={user}
        title={title}
        serverId={params.serverId}
        serverData={serverData}
        permissions={permissions}
      />,
    };
  },
};
