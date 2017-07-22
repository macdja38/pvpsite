/**
 * Created by macdja38 on 2017-07-07.
 */

import React  from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import WithStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ServerList.css';

function GuildList({ guilds }) {
  return (<div className={s.scroll}>
    {guilds.map(g => <div key={g.id}>
      <Avatar src={g.icon ? `https://discordapp.com/api/guilds/${g.id}/icons/${g.icon}.jpg` : null}>
        {g.icon ? '' : g.name}
      </Avatar>
    </div>)}
  </div>);
}

GuildList.propTypes = {
  guilds: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default WithStyles(s)(GuildList);
