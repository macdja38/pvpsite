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

const title = 'Profile page';
const description = 'Profile page';

export default {

  path: '/user/:userId/',
  auth: true,

  async action({ user, headers }, params) {
    if (!user) return { redirect: `/login/server/${params.serverId}/` };

    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (headers) {
      options.headers = headers;
    }

    if (params.userId !== user.id) {
      console.log('User trying to fetch user page that\'s not their own.');
    }

    return {
      title,
      description,
      component: <User user={user} />,
    };
  },
};
