import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './User.css';
import Layout from '../../components/Layout';


function User({ user }) {
  // let avatarURL = `https://discordapp.com/api/users/${user.id}/avatars/${user.avatar}.jpg`;

  return (
    <Layout user={user}>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>Profile Page</h1>
        </div>
      </div>
    </Layout>
  );
}


User.propTypes = { user: PropTypes.object.isRequired };

export default withStyles(s)(User);
