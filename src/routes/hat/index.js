import React from 'react';
import Hat from './Hat';

export default {

  path: '/hat/:id?/:hash?',

  action({ user }, params) {
    return {
      title: 'Hat | PvPCraft Discord Bot',
      description: 'Hat Page',
      component: <Hat user={user} userId={params.id} userHash={params.hash} />,
    };
  },
};
