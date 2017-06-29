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
import s from './Content.css';

function Content(props) {
  return (<div className={s.root} >{props.children}</div>);
}

Content.propTypes = {
  children: PropTypes.element.isRequired,
};

export default withStyles(s)(Content);
