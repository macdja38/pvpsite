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
import Layout from '../../components/Layout';
import s from './Content.css';

import fetch from '../../core/fetch';

class Content extends Component {
  componentDidMount() {
    if (document && document.getElementById('_carbonads_js')) {
      fetch('//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=botpvpcraftca', { mode: 'no-cors' })
        .then(res => {
          if (res.ok) {
            return res.text();
          }

          throw new Error(res.statusText);
        })
        .then(js => { console.log(js); window.eval(js); }).catch(console.error);
    }
  }

  render() {
    console.log('render of Content called');
    const { path, title, content, user } = this.props;
    return (
      <Layout user={user}>
        <div className={s.root}>
          <div className={s.container}>
            {title && path !== '/' && <h1>{title}</h1>}
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </Layout>
    );
  }
}

Content.propTypes = {
  path: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string,
  user: PropTypes.object,
};

export default withStyles(s)(Content);
