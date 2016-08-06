/**
 * Created by macdja38 on 2016-08-06.
 */

import { auth } from '../config';
import passport from 'passport';
import DiscordStrategy from 'passport-discord';
import r from '../db/index.js';

const scopes = ['identify', /* 'connections', (it is currently broken) */ 'guilds'];

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => r
  .table('users')
  .get(id)
  .run(r.conn)
  .then((user) => {
    done(null, user);
  }));

const loginCallbackHandler = (objectMapper, type) =>
  (accessToken, refreshToken, profile, done) => {
    if (accessToken !== null) {
      r
        .table('users')
        .getAll(profile.id, { index: 'id' })
        .filter({ type })
        .run(r.conn)
        .then((cursor) =>
          cursor.toArray()
            .then((users) => {
              if (users.length > 0) {
                return done(null, users[0]);
              }
              return r.table('users')
                .insert(objectMapper(profile))
                .run(r.conn)
                .then(() => r
                  .table('users')
                  .get(profile.id)
                  .run(r.conn)
                )
                .then((newUser) => {
                  done(null, newUser);
                });
            })
        )
        .catch(err => console.log('Error Getting User', err));
    }
  };

passport.use(new DiscordStrategy(
  {
    clientID: auth.discord.id,
    clientSecret: auth.discord.secret,
    scope: scopes,
    callbackURL: 'http://betabot.pvpcraft.ca/login/discord/callback',
  },
  loginCallbackHandler(profile => profile, 'discord')
));

passport.checkIfLoggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).send('You\'re not logged in');
};

module.exports = passport;
