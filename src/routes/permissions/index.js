/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Permissions from './Permissions';
import fetch from '../../core/fetch';

export default {

  path: '/server/:serverId/permissions',
  auth: true,

  async action(context, params) {
    console.log(1);
    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (context.headers) {
      options.headers = context.headers;
    }
    const permissionsResp = await fetch(`/api/v1/permissions/${params.serverId}`, options);
    const serverDataResp = await fetch(`/api/v1/server/${params.serverId}`, options);

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
        context.context.redirect(`/login/${params.serverId}/permissions`);
      }
    }

    let serverData;
    if (serverDataResp.status === 200) {
      serverData = await serverDataResp.json();
    }

    let permissions;
    if (permissionsResp.status === 200) {
      permissions = (await permissionsResp.json());
    }

    console.log(permissions);
    if (!permissions) return context.context.redirect(`/login/${params.serverId}/permissions`);
    if (!user) return new Error('User Object missing.');
    if (!serverData) return context.context.redirect(`/login/${params.serverId}/permissions`);

    return <Permissions user={user} serverId={params.serverId} serverData={serverData} permissions={permissions} />;
  },
};
