/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Languages from './Languages';
import fetch from '../../core/fetch';
import { oauth } from '../../client.config.js';

let title = 'Language Page | PvPCraft Discord Bot';
let description = 'Language webadmin pannel';

export default {

  path: '/server/:serverId/languages',
  auth: true,

  async action({ user, headers }, params) {
    if (!user) return { redirect: `/login/server/${params.serverId}/languages` };

    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (headers) {
      options.headers = headers;
    }

    const languageResp = await fetch(`/api/v1/languages/${params.serverId}`, options);
    const serverDataResp = await fetch(`/api/v1/server/${params.serverId}`, options);

    let serverData;
    if (serverDataResp.status === 200) {
      console.log(serverDataResp);
      serverData = await serverDataResp.json();
      console.log(serverData);
    } else {
      const redirect = `https://discordapp.com/oauth2/authorize?response_type=code&redirect_uri=${
        oauth.discord.url
        }%2Flogin%2Fdiscord%2Fcallback&scope=identify%20guilds%20bot&client_id=168133784078647296&guild_id=${
        params.serverId
        }&permissions=8`;

      if (typeof window !== 'undefined') {
        window.location = redirect;
      } else {
        return {
          redirect,
        };
      }
    }

    let languages;
    if (languageResp.status === 200) {
      languages = (await languageResp.json());
    }

    console.log(languages);
    if (!languages) return { redirect: `/login/server/${params.serverId}/languages` };
    if (!user) return { redirect: `/login/server/${params.serverId}/languages` };
    if (!serverData) return { redirect: `/login/server/${params.serverId}/languages` };

    const guild = user.guilds.find(serverGuild => params.serverId === serverGuild.id);

    if (!guild) return { redirect: `/login/server/${params.serverId}/languages` };

    title = `${guild.name}'s Languages`;
    description = `${guild.name}'s Languages Control panel`;

    return {
      title,
      description,
      component: <Languages
        guild={guild}
        user={user}
        title={title}
        serverId={params.serverId}
        serverData={serverData}
        languages={languages}
      />,
    };
  },
};
