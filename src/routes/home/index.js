import React from 'react';
import Home from './Home';

export default {

  path: '/',

  action({ user }) {
    return {
      title: 'Home | PvPCraft Discord Bot',
      description: 'Home Page',
      component: <Home user={user} />,
    };
  },
};
