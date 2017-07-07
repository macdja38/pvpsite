/**
 * Created by macdja38 on 2017-07-06.
 */

import React from 'react';
import User from './Channels';

const title = 'Server';
const description = 'Server';

export default {

  path: '/channels/',
  auth: false,

  async action({ user }) {
    // if (!user) return { redirect: `/login/server/${params.serverId}/` };
    return {
      title,
      description,
      component: <User user={user} />,
    };
  },
};
