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
import s from './CheckBox.css';

class CheckBox extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultChecked: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { checked: props.defaultChecked };
    this.onChecked = this.onChecked.bind(this);
  }

  onChecked() {
    const newValue = !this.state.checked;
    this.setState({ checked: newValue });
    this.props.onChange(newValue);
  }

  render() {
    return (
      <input type="checkbox" value={this.state.checked} onChange={this.onChecked} />
    );
  }

}

export default withStyles(s)(CheckBox);
