/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Login from './Login';

export default {

  path: '/login/:id?/:page?',

  action(context, params) {
    console.log(params);
    return <Login context={context} page={params.page} id={params.id} />;
  },

};
