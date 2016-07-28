/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

function Navigation({ className, user }) {
  if(user.user == null) {
    return (
      <div className={cx(s.root, className)} role="navigation">
        <Link className={s.link} to="/about">About</Link>
        <Link className={s.link} to="/contact">Contact</Link>
        <span className={s.spacer}> | </span>
        <Link className={cx(s.link, s.highlight)} to="/login">Log in</Link>
      </div>
    );
  }
  user = user.user;
  return (
    <div className={cx(s.root, className)} role="navigation">
      <Link className={s.link} to="/about">About</Link>
      <Link className={s.link} to="/contact">Contact</Link>
      <span className={s.spacer}> | </span>
      <div className={cx(s.link, s.highlight)}>
        <img className={s.avatar} height="32px" width="32px" src={`https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`}/>
        <span className={s.username}> {user.username}</span>
        <Link className={cx(s.link, s.highlight)} to="/logout">Log out</Link>
      </div>
    </div>
  );
  /*
  return (
    <div className={cx(s.root, className)} role="navigation">
      <Link className={s.link} to="/about">About</Link>
      <Link className={s.link} to="/contact">Contact</Link>
      <span className={s.spacer}> | </span>
      {((user == null) ?
        <Link className={cx(s.link, s.highlight)} to="/login">Log in</Link>
      :
        <img className={cx(s.link, s.highlight)} src={`https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`}>{user.username}</img> +
        <Link className={cx(s.link, s.highlight)} to="/logout">Log out</Link>
      )}
    </div>
  );
  */
}

Navigation.propTypes = {
  className: PropTypes.string,
};

export default withStyles(s)(Navigation);
