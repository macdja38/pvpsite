/**
 * Created by macdja38 on 2016-08-06.
 */

import passport from 'passport';
import refresh from 'passport-oauth2-refresh';
import DiscordStrategy from 'passport-discord';
import { auth, oauth } from '../config';
import r from '../db/index.js';

const currentRequests = {};

const scopes = ['identify', /* 'connections', (it is currently broken) */ 'guilds'];

function loginCallbackHandler(objectMapper, type) {
  return (accessToken, refreshToken, profile, done) => {
    if (accessToken !== null) {
      const userProfile = profile;
      userProfile.accessToken = accessToken;
      userProfile.refreshToken = refreshToken;
      userProfile.fetched = new Date();
      r.table('users')
        .getAll(userProfile.id, { index: 'id' })
        .filter({ type })
        .run()
        .then((users) => {
          if (users.length > 0) {
            return done(null, users[0]);
          }
          return r.table('users')
            .insert(objectMapper(userProfile), { conflict: 'update' })
            .run()
            .then(() => r
              .table('users')
              .get(userProfile.id)
              .run(),
            )
            .then((newUser) => {
              done(null, newUser);
            });
        })
        .catch(err => {done(err); console.log('Error Getting User', err)}); // eslint-disable-line no-console
    }
  };
}

function saveProfile(profile) {
  console.log('saving profile with access token ', profile.accessToken, ' and id ', profile.id);
  const userProfile = profile;
  return r.table('users')
    .insert(userProfile, { conflict: 'update' })
    .run()
    .then(() => r
      .table('users')
      .get(userProfile.id)
      .run(),
    );
}

const strategy = new DiscordStrategy(
  {
    clientID: auth.discord.id,
    clientSecret: auth.discord.secret,
    scope: scopes,
    callbackURL: `${oauth.discord.url}/login/discord/callback`,
  },
  loginCallbackHandler(profile => profile, 'discord'),
);

function getUpdatedUserData(profile) {
  return new Promise((resolve, reject) => {
    let tryCount = 3;
    const attempt = () => {
      tryCount--; // eslint-disable-line
      if (!tryCount) {
        reject(new Error('too many tries'));
      }
      strategy.userProfile(profile.accessToken, (profileErr, newUser) => {
        if (profileErr) {
          refresh.requestNewAccessToken(profile.provider, profile.refreshToken, (refreshErr, accessToken) => {
            if (refreshErr) {
              return reject(refreshErr);
            }
            profile.accessToken = accessToken; // eslint-disable-line
            attempt(profile);
          });
        } else {
          newUser.fetched = new Date(); // eslint-disable-line
          newUser.accessToken = profile.accessToken; // eslint-disable-line
          saveProfile(newUser).then(user => resolve(user));
        }
      });
    };
    attempt();
  });
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
  r
    .table('users')
    .get(id)
    .run()
    .then((user) => {
      const age = new Date(user.fetched);
      const timeSinceFetchedInMinutes = (Date.now() - age) / 1000 / 60;
      if (timeSinceFetchedInMinutes > 4) {
        if (!currentRequests.hasOwnProperty(user.id)) {
          currentRequests[user.id] = getUpdatedUserData(user);
          setTimeout(() => {
            delete currentRequests[user.id];
          }, 10000);
        }
        currentRequests[user.id].then(userResult => done(null, userResult)).catch(error => done(error));
        return;
      }
      done(null, user);
    }).catch(done));

passport.use(strategy);
refresh.use(strategy);

passport.checkIfLoggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).send('You\'re not logged in');
};

export default passport;
