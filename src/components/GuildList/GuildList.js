/**
 * Created by macdja38 on 2017-07-07.
 */

import React  from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import WithStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../Link';
import s from './GuildList.css';

function GuildList({ guilds }) {
  return (<div className={s.scrollContainer}>
    <div className={s.scroll}>
      {guilds.map(g => <div key={g.id}>
        <Link to={`/channels/${g.id}/${g.id}`}>
          <Avatar src={g.icon ? `https://discordapp.com/api/guilds/${g.id}/icons/${g.icon}.jpg` : null}>
            {g.icon ? '' : g.name}
          </Avatar>
        </Link>
      </div>)}
    </div>
  </div>);
}

GuildList.propTypes = {
  guilds: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default WithStyles(s)(GuildList);
