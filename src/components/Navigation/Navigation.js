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
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

const DefaultAvatarHashes = [
  '6debd47ed13483642cf09e832ed0bc1b',
  '322c936a8c8be1b803cd94861bdfa868',
  'dd4dbc0016779df1378e7812eabaa04d',
  '0e291f67c9274a1abdddeb3fd919cbaa',
  '1cbd08c76f8af6dddce02c5138971129',
];

function getUserAvatar(user) {
  if (user.avatar) {
    return `https://discordapp.com/api/users/${user.id}/avatars/${user.avatar}.jpg`;
  }
  const defaultAvatarHash = DefaultAvatarHashes[user.discriminator % DefaultAvatarHashes.length];
  return `https://discordapp.com/assets/${defaultAvatarHash}.png`;
}

function Navigation({ className, user }) {
  if (user == null) {
    return (
      <div className={cx(s.root, className)} role="navigation">
        <Link className={s.link} to="/about">About</Link>
        <Link className={s.link} to="/contact">Contact</Link>
        <Link className={s.link} to="/docs">Docs</Link>
        <Link className={s.link} to="/donate">Donate</Link>
        <span className={s.spacer}> | </span>
        <Link className={cx(s.link, s.highlight)} to="/login">Log in</Link>
      </div>
    );
  }
  return (
    <div className={cx(s.root, className)} role="navigation">
      <Link className={s.link} to="/about">About</Link>
      <Link className={s.link} to="/contact">Contact</Link>
      <Link className={s.link} to="/docs">Docs</Link>
      <Link className={s.link} to="/donate">Donate</Link>
      <Link className={s.link} to="/server">Servers</Link>
      <span className={s.spacer}> | </span>
      <div className={cx(s.link, s.highlight)}>
        <Link className={s.username} to={`/user/${user.id}`}>
          <span> {user.username}</span>
          <img
            alt=""
            className={s.avatar}
            height="32px"
            width="32px"
            src={getUserAvatar(user)}
          />
        </Link>
        <a className={cx(s.link, s.highlight)} href="/logout">Log out</a>
      </div>
    </div>
  );
  /*
  return (
    <div className={cx(s.root, className)} role="navigation">
      <Link className={s.link} to="/about">About</Link>
      <Link className={s.link} to="/contact">Contact</Link>
      <span className={s.spacer}> | </span>
      <Link className={cx(s.link, s.highlight)} to="/login">Log in</Link>
    </div>
  );
  */
}

Navigation.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
};

export default withStyles(s)(Navigation);
