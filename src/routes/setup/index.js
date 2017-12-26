import React from 'react';
import Setup from './Setup';
import fetch from '../../core/fetch';

import { oauth } from '../../client.config.js';

let title = 'Server List';
const description = 'Server List Page';

export default {

  path: '/server/:serverId/setup',
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

    const serverDataResp = await fetch(`/api/v1/server/${params.serverId}`, options);

    let serverData;
    if (serverDataResp.status === 200) {
      console.log(serverDataResp);
      serverData = await serverDataResp.json();
      console.log(serverData);
    } else if (typeof window !== 'undefined') {
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


    if (!user) return { redirect: `/login/server/${params.serverId}/setup` };
    if (!serverData) return { redirect: `/login/server/${params.serverId}/setup` };

    const guild = user.guilds.find(serverGuild => params.serverId === serverGuild.id);

    if (!guild) return { redirect: `/login/server/${params.serverId}/setup` };

    title = `Setup ${guild.name}`;

    return {
      title,
      description,
      component: <Setup title={title} user={user} gulid={guild} serverData={serverData} />,
    };
  },

};
