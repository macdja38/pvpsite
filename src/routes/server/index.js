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

export default {

  path: '/server/:id',
  auth: true,

  async action({ user }, params) {
    if (!user) throw new Error('User Object missing.');
    return <Server user={user} server_id={params.id} />
  },

};
