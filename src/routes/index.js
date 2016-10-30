/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import App from '../components/App';

// Child routes
import home from './home';
import userPage from './user';
import serverList from './serverList';
import server from './server';
import permissions from './permissions';
import login from './login';
import music from './music';
import content from './content';
import error from './error';

export default {

  path: '/',

  children: [
    login,
    home,
    userPage,
    server,
    serverList,
    permissions,
    music,
    content,
    error,
  ],

  async action({ next, render, context, user, query }) {
    const component = await next();
    if (component === undefined) return component;
    if (component instanceof Error) return component;
    const userContext = context;
    userContext.user = user;
    return render(
      <App context={userContext} user={user} >{component}</App>
    );
  },

};
