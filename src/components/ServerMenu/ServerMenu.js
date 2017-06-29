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
import s from './ServerMenu.css';
import Link from '../Link';

function ServerMenu({ className, user, serverId, page }) {
  if (user == null || user.user == null) {
    return (
      <div className={cx(s.root, className)} role="navigation">
        <div className={s.menu}>
          <Link className={page === 'server' ? cx(s.link, s.active) : s.link} to={`/server/${serverId}`}>Server</Link>
          <Link className={page === 'music' ? cx(s.link, s.active) : s.link} to={`/server/${serverId}/music`}>
            Music
          </Link>
          <Link
            className={page === 'permissions' ? cx(s.link, s.active) : s.link}
            to={`/server/${serverId}/permissions`}
          >
            Permissions
          </Link>
          <Link className={s.link} to="/docs">Docs</Link>
        </div>
      </div>
    );
  }
}

ServerMenu.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  serverId: PropTypes.string,
  page: PropTypes.string,
};

export default withStyles(s)(ServerMenu);
