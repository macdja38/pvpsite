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

function getUserAvatar(user) {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  }
  return `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
}

function Navigation({ className, user }) {
  if (user == null) {
    return (
      <div className={cx(s.root, className)} role="navigation">
        <a className={cx(s.link, s.highlight)} href="https://invite.pvpcraft.ca">Invite</a>
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
      <a className={cx(s.link, s.highlight)} href="https://invite.pvpcraft.ca">Invite</a>
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
}

Navigation.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
};

export default withStyles(s)(Navigation);
