import 'babel-polyfill';
import 'source-map-support/register';
import path from 'path';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './components/Html';
import { ErrorPage } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import passport from 'passport';
import logger from 'morgan';
import schema from './data/schema';
import routes from './routes';
import { auth, port, database, sentry } from './config';
import prefix from './api/v1/prefix';
import user from './api/v1/user';
import permissions from './api/v1/permissions';
import music from './api/v1/music';
import oembed from './api/v1/oembed';
import server from './api/v1/server';
import R from 'rethinkdbdash';
import authMiddleware from './core/auth';
import RDBStore from 'session-rethinkdb';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import raven from 'raven';

import Eris from 'eris';
const eris = new Eris(auth.discord.token, { autoreconnect: true, cleanContent: false, messageLimit: null, });

const r = new R({ servers: [
  database.reThinkDB,
] });

const db = { r, connPromise: r.connect(database.reThinkDB) };

const app = express();

const RDBStoreSession = new RDBStore(session);

const store = new RDBStoreSession(r, {
  browserSessionsMaxAge: 5000, // optional, default is 60000 (60 seconds). Time between clearing expired sessions.
  table: 'session', // optional, default is 'session'. Table to store sessions in.
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(logger('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(raven.middleware.express.requestHandler(sentry.serverDSN));
app.use(raven.middleware.express.errorHandler(sentry.serverDSN));

//
// Authentication
// -----------------------------------------------------------------------------

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
  return true;
}

app.use(session({
  secret: 'keyboard cat-acomb',
  resave: false,
  httpOnly: true,
  sameSite: true,
  store,
  saveUninitialized: true,
  cookie: { secure: 'auto', maxAge: 86400000 },
}));

app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/login/discord/callback',
  authMiddleware.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/server/') // auth success
);
app.get('/login/discord', authMiddleware.authenticate('discord'));

app.get('/logout', checkAuth, (req, res) => {
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
prefix(app, db, eris);
user(app, db, eris);
permissions(app, db, eris);
music(app, db, eris);
oembed(app, db, eris);
server(app, db, eris);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    let css = new Set();
    let statusCode = 200;
    const data = { title: 'PvPCraft', description: 'PvPCraft discord bot', style: '', script: assets.main.js, children: '' };

    await UniversalRouter.resolve(routes, {
      user: req.user,
      headers: req.headers,
      path: req.path,
      query: req.query,
      context: {
        insertCss: (...styles) => {
          styles.forEach(style => css.add(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
        },
        setDescription: value => (data.description = value),
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
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
/* eslint-enable no-console */

eris.connect();
