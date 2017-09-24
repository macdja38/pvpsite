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
import n from './Normalize.css';
import s from './Layout.css';
import Content from '../Content';
import Footer from '../Footer';

import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './logo-small.png';

function Layout({ children, user }) {
  console.log(user);
  return (
    <div className={s.grid}>
      <div className={s.content}>
        <Link className={s.banner} to="/">
          <h1 className={s.bannerTitle}>PvPCraft</h1>
          <p className={s.bannerDesc}>Just the best Discord bot</p>
        </Link>
        <Content>
          {React.Children.only(children)}
        </Content>
      </div>
      <div className={s.background} />
      <div className={s.left}>
        <Link className={s.brand} to="/">
          <img src={logoUrl} width="44" height="44" alt="PvPCraft" />
          <span className={s.brandTxt}>PvPCraft</span>
        </Link>
      </div>
      <Navigation className={s.right} user={user} />
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  user: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default withStyles(s)(withStyles(n)(Layout));
