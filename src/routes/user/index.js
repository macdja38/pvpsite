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
    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (context.headers) {
      options.headers = context.headers;
    }

    let user;
    if (context.user) {
      console.log('Got cached User');
      user = context.user;
    } else {
      try {
        const resp = await fetch('/api/v1/user/', options);
        console.log('Fetching user');
        user = await resp.json();
      } catch (error) {
        throw new Error(`User Object request failed. Error: ${error}`);
      }
    }

    if (params.userId !== user.id) {
      console.log('User trying to fetch user page that\'s not their own.');
    }

    return <User user={user} />;
  },
};
