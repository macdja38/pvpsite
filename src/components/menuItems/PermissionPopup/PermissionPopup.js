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
import s from './PermissionPopup.css';
import Selector from '../../Selector';


class PermissionPopup extends Component {

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    settingsMap: PropTypes.object.isRequired,
  };

  render() {
    return (<div>

      <Selector
        placeHolder="channels" label={'Channels'} callback={this.channelCallback} items={channels}
      />

      <Selector
        placeHolder="groups/users" label={'Users/Roles'} callback={this.userAndGroupCallback} items={userChoices}
      />
    </div>);
  }

}

export default withStyles(s)(PermissionPopup);
