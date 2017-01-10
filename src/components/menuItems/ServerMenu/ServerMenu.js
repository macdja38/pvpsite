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
import s from './ServerMenu.css';
import Link from '../../Link';

function ServerMenu({ serverId, page, pages }) {
  return (
    <div className={cx(s.root)} role="navigation">
      <div className={s.menu}>
        {pages.map(p => (<Link
          key={p}
          className={p === page ? cx(s.link, s.active) : s.link}
          to={`/server/${serverId}/${p}`}
        >{p}</Link>))}
      </div>
    </div>
  );
}

ServerMenu.propTypes = {
  serverId: PropTypes.string,
  pages: PropTypes.array,
  page: PropTypes.string,
};

export default withStyles(s)(ServerMenu);
