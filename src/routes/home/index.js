import React from 'react';
import Home from './Home';

export default {

  path: '/',

  async action({ user }) {
    return {
      title: 'Home',
      description: 'Home Page',
      component: <Home user={user} />,
    };
  },
};
