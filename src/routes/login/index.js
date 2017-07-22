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

const title = 'Log In';
const description = 'Login to the PvPCraft webadmin panel.';

function action({ user }, params) {
  return {
    chunks: ['home'],
    title,
    description,
    component: <Login user={user} title={title} nextPage={params.nextPage} />,
  };
}

export default action;
