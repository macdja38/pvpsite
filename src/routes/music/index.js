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

export default {

  path: '/server/:serverId/music',
  auth: true,

  async action(context, params) {
    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (context.headers) {
      options.headers = context.headers;
    }

    let musicResp;
    try {
      musicResp = await fetch(`/api/v1/music/${params.serverId}`, options);
    } catch (error) {
      console.error('prefix Resp caught', error);
    }

    let user;
    if (context.user) {
      console.log("Got cached User");
      user = context.user;
    } else {
      try {
        const resp = await fetch('/api/v1/user/', options);
        console.log("Fetching user");
        user = await resp.json();
      } catch (error) {
        throw new Error(`User Object request failed. Error: ${error}`);
      }
    }

    let music;
    if (musicResp.status === 200) {
      music = (await musicResp.json());
    }

    console.log(music);
    // if (!prefix) throw new Error('Prefix Object missing.');
    if (!user) throw new Error('User Object missing.');

    return <Music user={user} serverId={params.serverId} music={music} />;
  },
};
