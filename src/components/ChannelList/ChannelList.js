/**
 * Created by macdja38 on 2017-07-07.
 */

import React from 'react';
import PropTypes from 'prop-types';
import WithStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../Link';
import s from './ChannelList.css';

function ChannelList({ guildId, channels }) {
  return (<div className={s.scrollContainer}>
    <div className={s.scroll}>
      {channels.filter(c => c.type === 0).map(c => (<div key={c.id} className={s.channelBox}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            d={'M2.27333333,12 L2.74666667,9.33333333 L0.08,9.33333333 L0.313333333,8 L2.98,8 L3.68666667,4' +
            ' L1.02,4 L1.25333333,2.66666667 L3.92,2.66666667 L4.39333333,0 L5.72666667,0 L5.25333333,2.66666667' +
            ' L9.25333333,2.66666667 L9.72666667,0 L11.06,0 L10.5866667,2.66666667 L13.2533333,2.66666667 L13.02,4' +
            ' L10.3533333,4 L9.64666667,8 L12.3133333,8 L12.08,9.33333333 L9.41333333,9.33333333 L8.94,12' +
            ' L7.60666667,12 L8.08,9.33333333 L4.08,9.33333333 L3.60666667,12 L2.27333333,12 L2.27333333,12' +
            ' Z M5.02,4 L4.31333333,8 L8.31333333,8 L9.02,4 L5.02,4 L5.02,4 Z'}
          />
        </svg>
        <Link className={s.channelText} to={`/channels/${guildId}/${c.id}`}>
          {c.name}
        </Link>
      </div>))}
      {channels.filter(c => c.type === 2).map(c => (<div key={c.id} className={s.channelBox}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            d={'M9.33333333,2 L9.33333333,3.37333333 C11.26,3.94666667 12.6666667,5.73333333 12.6666667,7.84666667' +
            ' C12.6666667,9.96 11.26,11.74 9.33333333,12.3133333 L9.33333333,13.6933333 C12,13.0866667 14,10.7' +
            ' 14,7.84666667 C14,4.99333333 12,2.60666667 9.33333333,2 L9.33333333,2 Z M11,7.84666667 C11,6.66666667' +
            ' 10.3333333,5.65333333 9.33333333,5.16 L9.33333333,10.5133333 C10.3333333,10.04 11,9.02 11,7.84666667' +
            ' L11,7.84666667 Z M2,5.84666667 L2,9.84666667 L4.66666667,9.84666667 L8,13.18 L8,2.51333333' +
            ' L4.66666667,5.84666667 L2,5.84666667 L2,5.84666667 Z'}
          />
        </svg>
        <Link className={s.channelText} to={`/channels/${guildId}/${c.id}`}>
          {c.name}
        </Link>
      </div>))}
    </div>
  </div>);
}

ChannelList.propTypes = {
  guildId: PropTypes.string.isRequired,
//  guilds: PropTypes.arrayOf(PropTypes.object).isRequired,
  channels: PropTypes.arrayOf(PropTypes.object).isRequired,
  channelId: PropTypes.string.isRequired,
};

export default WithStyles(s)(ChannelList);
