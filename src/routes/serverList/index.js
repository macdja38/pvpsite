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

export default {

  path: '/server',
  auth: true,

  async action({ user }) {
    console.log(user);
    if (!user) throw new Error('User Object missing.');
    return <ServerList user={user} />
  },

};
