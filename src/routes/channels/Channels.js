/**
 * Created by macdja38 on 2017-07-06.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from 'antd';
import GuildList from '../../components/GuildList';
import GuildMenu from './GuildMenu/GuildMenu'
import s from './Channels.css';

class Channels extends Component {
  static PropTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    console.log(this.context);
    console.log(this.props);
    return (
      <Row style={{ overflow: 'hidden', height: '100vh' }}>
        <Col span={1} style={{ overflow: 'hidden' }}><GuildList guilds={this.props.user.guilds} /></Col>
        {this.props.channelId && this.props.guildId ? (<div><Col span={3}>
          <div style={{ background: 'blue' }}>b</div>
        </Col>
        <Col span={20}>
          <div>c</div>
        </Col></div>) : (<GuildMenu></GuildMenu>)}
      </Row>
    )
  };
}

export default withStyles(s)(Channels);
