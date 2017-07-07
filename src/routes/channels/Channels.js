/**
 * Created by macdja38 on 2017-07-06.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from 'antd';
import ServerList from '../../components/ServerList';
import s from './Channels.css';

function User({ user }) {
  console.log(user);
  return (
    <Row style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, overflow: 'hidden' }}>
      <Col span={1}><ServerList guilds={user.guilds} /></Col>
      <Col span={3}>
        <div style={{ background: 'green' }}>b</div>
      </Col>
      <Col span={20}>
        <div>c</div>
      </Col>
    </Row>
  );
}


User.propTypes = { user: PropTypes.object.isRequired };

export default withStyles(s)(User);
