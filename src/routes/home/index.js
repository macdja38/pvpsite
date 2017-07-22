import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

const title = 'PvPCraft - Home';

function action({ fetch }) {
  console.log(fetch);
  return {
    chunks: ['home'],
    title,
    component: <Home title={title} />,
    status: 404,
  };
}

export default action;
