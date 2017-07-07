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
import fetch from '../../core/fetch';
import s from './PrefixField.css';

class PrefixField extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    serverId: PropTypes.string.isRequired,
    prefix: PropTypes.array.isRequired,
    onClick: PropTypes.func,
  };

  prefixChange = (event, serverId) => {
    this.setState({ stage: 'changed' });
    fetch(`/api/v1/prefix/${serverId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ prefix: event.target.value }),
    }).then(() => {
      this.setState({ stage: 'saved' });
    });
    event.preventDefault();
  };

  render() {
    const { prefix, serverId } = this.props; // eslint-disable-line no-use-before-define
    return (
      <input
        type="text"
        name="prefix"
        className={this.state ? s[this.state.stage] : s.untouched}
        defaultValue={prefix}
        onChange={(e) => { this.prefixChange(e, serverId); }}
      />
    );
  }

}

export default withStyles(s)(PrefixField);
