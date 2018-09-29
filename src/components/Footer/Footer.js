/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';
import Feedback from '../Feedback';
import Link from '../Link';

function Footer() {
  return (
    <div className={s.root}>
      <hr className={s.bar} />
      <Feedback />
      <div className={s.container}>
        <span className={s.text}>© PvPCraft</span>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/">Home</Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/privacy">Privacy</Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/contact">Contact</Link>
      </div>
    </div>
  );
}

export default withStyles(s)(Footer);
