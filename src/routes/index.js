/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/*
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
*/

/* eslint-disable global-require */

export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    require('./home').default,
    require('./user').default,
    require('./login').default,
    require('./serverList').default,
    require('./server').default,
    require('./permissions').default,
    require('./login').default,
    require('./music').default,

    // place new routes before...
    require('./content').default,
    require('./notFound').default,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - https://bot.pvpcraft.ca`;
    route.description = route.description || '';

    return route;
  },

};

/*
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

  async action({ next, render, context, user }) {
    const component = await next();
    if (component === undefined) return component;
    if (component instanceof Error) return component;
    return render(
      <App context={userContext} user={user} >{component}</App>
    );
  },

};
*/
