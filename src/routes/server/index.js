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

export default {

  path: '/user/:userId/server/:serverId',
  auth: true,

  async action(context, params) {
    const prefixResp = await fetch(`/api/v1/prefix/${params.serverId}`, {
      method: 'get',
      credentials: 'include',
    });

    const userResp = await fetch(`/api/v1/user/${params.userId}`, {
      method: 'get',
      credentials: 'include',
    });

    const prefix = (await prefixResp.json()).prefix;
    const user = await userResp.json();

    if (!prefix) throw new Error('Prefix Object missing.');
    if (!user) throw new Error('User Object missing.');

    return <Server user={user} serverId={params.serverId} prefix={prefix} />;
  },
};
