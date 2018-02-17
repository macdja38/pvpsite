/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Music from './Music';
import fetch from '../../core/fetch';

let title = 'Music | PvPCraft Discord Bot';
let description = 'Queued music';

export default {

  path: '/server/:serverId/music',
  auth: true,

  async action({ user, headers }, params) {
    if (!user) return { redirect: `/login/server/${params.serverId}/music` };

    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (headers) {
      options.headers = headers;
    }

    let musicResp;
    try {
      musicResp = await fetch(`/api/v1/music/${params.serverId}`, options);
    } catch (error) {
      return { redirect: `/login/server/${params.serverId}/music` };
    }

    let music;
    if (musicResp.status === 200) {
      music = (await musicResp.json());
    }

    const guild = user.guilds.find(serverGuild => params.serverId === serverGuild.id);

    if (!guild) return { redirect: `/login/server/${params.serverId}/music` };

    title = `${guild.name}'s Music`;
    description = `Queued music for ${guild.name}`;

    // if (!prefix) throw new Error('Prefix Object missing.');
    if (!user) throw new Error('User Object missing.');

    return {
      title,
      description,
      component: <Music title={title} user={user} serverId={params.serverId} music={music} />,
    };
  },
};
