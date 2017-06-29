/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Home.css';

function Home({ user }) {
  return (
    <Layout user={user} >
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>PvPCraft Discord bot.</h1>
          <p>
            Welcome to the discord bot you&#39;ve always known you&#39;ve wanted but could never find.
            Inside you will find the most advanced permissions system, highly configurable prompts, intelligently
            designed rate limits and everything else you could ever want from a Discord bot.
            With dozens of modules available and more available on request the
            pvpcraft Discord bot is the bot that is right for you!
          </p>
        </div>
      </div>
    </Layout>
  );
}

Home.propTypes = {
  user: PropTypes.object,
};

export default withStyles(s)(Home);
