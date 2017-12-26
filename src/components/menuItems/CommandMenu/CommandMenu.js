/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './InputBox.css';

class PrefixField extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  render() {
    const { children } = this.props; // eslint-disable-line no-use-before-define
    return (
      <div
        className={s.box}
      >{children}</div>
    );
  }

}

export default withStyles(s)(PrefixField);
