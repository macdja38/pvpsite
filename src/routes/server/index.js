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

  async action({ user, req }, params) {
    console.log('Request');
    console.log(req.headers);
    const resp = await fetch(`/api/v1/prefix/${user.id}`, {
      method: 'get',
      headers: req.headers,
      credentials: 'include',
    });
    console.log('Request Concluded');
    console.log(resp);
    console.log(user);
    if (!user) throw new Error('User Object missing.');
    const { prefix } = await resp.json();
    return <Server user={user} serverId={params.id} prefix={prefix} />;
  },
};
