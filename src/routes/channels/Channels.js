/**
 * Created by macdja38 on 2017-07-06.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import GuildList from '../../components/GuildList';
import ChannelList from '../../components/ChannelList';
import GuildMenu from './GuildMenu/GuildMenu';
import s from './Channels.css';

class Channels extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    channelId: PropTypes.oneOf([PropTypes.string, PropTypes.bool]),
    guildId: PropTypes.oneOf([PropTypes.string, PropTypes.bool]),
    guildData: PropTypes.object,
  };

  static defaultProps = {
    channelId: false,
    guildId: false,
  };

  render() {
    console.debug(this.context);
    console.debug(this.props);
    return (
      <div className={s.gridBox}>
        <div style={{ overflow: 'hidden' }}>
          <GuildList guilds={this.props.user.guilds} />
        </div>
        {this.props.channelId && this.props.guildId && this.props.guildData ? (
          <ChannelList
            guildId={this.props.guildId}
            channels={this.props.guildData.channels}
            channelId={this.props.channelId}
          >channels</ChannelList>
        ) : ''}
        {this.props.channelId && this.props.guildId ? (
          <div>channel settings</div>
        ) : (<GuildMenu />)}
      </div>
    );
  }
}

export default withStyles(s)(Channels);
