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
import FontAwesome from 'react-fontawesome';
import s from './CommandMenu.css';


class CommandMenu extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    settingsMap: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { dropDown: false };
    this.flipDropDown = this.flipDropDown.bind(this);
  }

  flipDropDown() {
    this.setState({ dropDown: !this.state.dropDown });
  }

  render() {
    console.log('props', this.props);
    const { children } = this.props; // eslint-disable-line no-use-before-define
    console.log('commandMenu Children', children);
    return (
      <div
        className={s.box}
      >
        <div className={s.headerTitle}>
          <div className={s.headerTitleOpen}>
            <button type="button" onClick={this.flipDropDown}>
              <FontAwesome
                className={s.headerLock}
                name={this.state.dropDown ? 'caret-down' : 'caret-up'} size="2x"
              />
            </button>
          </div>
          <div className={s.headerTitleText}>
            {this.props.settingsMap.name}
            {this.state.dropDown ? <hr /> : ''}
            {this.state.dropDown ? this.props.settingsMap.description : ''}
          </div>
          <button type="button" className={s.headerTitleLock}><FontAwesome name="lock" size="2x" /></button>
        </div>
        {this.state.dropDown ?
          <hr className={s.dividerLine} /> : ''}
        {this.state.dropDown ?
          <div className={s.childBox}>{children}</div> : ''}
      </div>
    );
  }

}

export default withStyles(s)(CommandMenu);
