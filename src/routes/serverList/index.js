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

export default {

  path: '/user/:userId/server/',
  auth: true,

  async action(req, params) {
    const resp = await fetch(`/api/v1/user/${params.userId}`, {
      method: 'get',
      headers: req.headers,
      credentials: 'include',
    });
    const user = await resp.json();
    console.log('User');
    console.log(user);
    if (!user) throw new Error('User Object missing.');
    return <ServerList user={user} />;
  },

};
