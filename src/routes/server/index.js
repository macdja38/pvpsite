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

  path: '/server/:id',
  auth: true,

  async action({ user, req }, params) {
    console.log("server index reached.");
    const resp = await fetch(`api/v1/prefix/${user.id}`, {
      method: 'get',
      headers: {...req.headers},
      credentials: 'include'
    });
    console.log(resp);
    console.log(resp.body);
    //if (!user) throw new Error('User Object missing.');
    //return <Server user={user} server_id={params.id} />
  },

};
