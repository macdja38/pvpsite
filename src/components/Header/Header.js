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
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import PurpleBar from '../PurpleBar';
import logoUrl from './logo-small.png';

function Header(user) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <PurpleBar />
        <div className={s.banner}>
          <h1 className={s.bannerTitle}>PvPCraft</h1>
          <p className={s.bannerDesc}>Just the best Discord bot</p>
        </div>
        <div className={s.navBar}>
          <Navigation className={s.nav} user={user} />
          <Link className={s.brand} to="/">
            <img src={logoUrl} width="44" height="44" alt="PvPCraft" />
            <span className={s.brandTxt}>PvPCraft</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  user: PropTypes.object,
};

export default withStyles(s)(Header);
