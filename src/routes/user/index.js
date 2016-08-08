/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import User from './User';
import fetch from '../../core/fetch';

export default {

  path: '/user/:userId/',
  auth: true,

  async action(context, params) {
    const resp = await fetch(`/api/v1/user/${params.userId}`, {
      method: 'get',
      credentials: 'include',
    });

    const user = await resp.json();
    return <User user={user} />;
  },
};
