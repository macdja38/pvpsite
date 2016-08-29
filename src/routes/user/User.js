import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './User.css';
// import fetch from '../../core/fetch';

const title = 'Profile page';

function User(props, context) {
  context.setTitle(title);

  // let avatarURL = `https://discordapp.com/api/users/${user.id}/avatars/${user.avatar}.jpg`;

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>Profile Page</h1>
      </div>
    </div>
  );
}


User.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(User);
