/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './components/Html';
import { ErrorPage } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import passport from 'passport';
import DiscordStrategy from 'passport-discord';
import logger from 'morgan';
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { port, auth, database } from './config';
import prefix from './api/v1/prefix';
import user from './api/v1/user';
import r from 'rethinkdb';

const db = { r, connPromise: r.connect(database.reThinkDB) };

const scopes = ['identify', /* 'connections', (it is currently broken) */ 'guilds'];

const app = express();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
passport.use(new DiscordStrategy(
  {
    clientID: auth.discord.id,
    clientSecret: auth.discord.secret,
    callbackURL: 'http://betabot.pvpcraft.ca/login/discord/callback',
    scope: scopes,
  },
  (accessToken, refreshToken, profile, cb) => process.nextTick(() => cb(null, profile))
));

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
  return true;
}

app.use(session({
  secret: 'keyboard cat-acomb',
  resave: true,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/login/discord', passport.authenticate('discord', { scope: scopes }, (req, res) => {
}));
app.get('/login/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }), (req, res) =>
    res.redirect(`/user/${req.user.id}/server/`) // auth success
);
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
app.get('/info', checkAuth, (req, res) => {
  // console.log(req.user)
  res.json(req.user);
  // res.send("Welcome " + req.user.username);
});

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));
prefix(app, db);
user(app, db);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    let css = new Set();
    let statusCode = 200;
    const data = { title: '', description: '', style: '', script: assets.main.js, children: '' };

    await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      context: {
        insertCss: (...styles) => {
          styles.forEach(style => css.add(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
        },
        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      },
      render(component, status = 200) {
        css = new Set();
        statusCode = status;
        data.children = ReactDOM.renderToString(component);
        data.style = [...css].join('');
        return true;
      },
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);

    res.status(statusCode);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const statusCode = err.status || 500;
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
    {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>
  );
  res.status(statusCode);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
/* eslint-enable no-console */
