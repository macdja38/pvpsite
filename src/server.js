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
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import passport from 'passport';
import logger from 'morgan';
import RDBStore from 'session-rethinkdb';
import Raven from 'raven';
import r from './db';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import base64 from './core/base64';
import schema from './data/schema';
import routes from './routes';
import { port, sentry } from './config';
import prefix from './api/v1/prefix';
import user from './api/v1/user';
import permissions from './api/v1/permissions';
import music from './api/v1/music';
import oembed from './api/v1/oembed';
import server from './api/v1/server';
import languages from './api/v1/languages';
import avatarProxy from './api/v1/avatarProxy';
import settings from './api/v1/settings';
import authMiddleware from './core/auth';
// noinspection JSFileReferences
import assets from './assets.json'; // eslint-disable-line import/no-unresolved

Raven.config(sentry.serverDSN, { environment: process.env.NODE_ENV }).install();

const app = express();

const RDBStoreSession = new RDBStore(session);

const store = new RDBStoreSession(r, {
  browserSessionsMaxAge: 60000, // optional, default is 60000 (60 seconds). Time between clearing expired sessions.
  table: 'session', // optional, default is 'session'. Table to store sessions in.
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Apply settings
app.set('trust proxy', true);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(Raven.requestHandler());
app.use(logger('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(Raven.errorHandler());

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
  store,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: true,
    secure: 'auto', // true, server setup is behind a proxy and hsts is deployed for pvpcraft.ca with long duration
    maxAge: 2592000000,
  },
}));

if (__DEV__) {
  app.enable('trust proxy');
}

app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/login/discord/callback',
  authMiddleware.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    if (req.query.hasOwnProperty('guild_id')) {
      res.redirect(`/server/${req.query.guild_id}`);
    } else if (req.query.hasOwnProperty('state')) {
      res.redirect(`/${base64.toText(req.query.state)}`);
    } else {
      res.redirect('/server/');
    }
  }, // auth success
);
app.get('/login-handler/discord/*?', (...args) =>
  authMiddleware.authenticate('discord', args[0].params[0] ? {
    state: base64.toBase64(`${args[0].params[0]}`),
  } : {})(...args),
);

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
  graphiql: __DEV__,
  rootValue: { request: req },
  pretty: __DEV__,
})));
prefix(app, r);
user(app, r);
permissions(app, r);
music(app, r);
oembed(app, r);
server(app, r);
settings(app, r);
languages(app, r);
avatarProxy(app);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
    };

    const route = await UniversalRouter.resolve(routes, {
      user: req.user,
      path: req.path,
      headers: req.headers,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    data.scripts = [assets.vendor.js, assets.client.js];
    data.chunk = assets[route.chunk] && assets[route.chunk].js;
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);

    res.status(route.status || 200);
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
  Raven.captureException(err);
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
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

process.on('unhandledRejection', (reason, p) => {
  if (Raven) {
    Raven.captureException(reason, {
      extra: { promise: p },
    }, (result) => {
      console.error(
        'Unhandled Rejection at: Promise',
        p,
        'reason:',
        reason,
        ` sentry Id: ${Raven.getIdent(result)}`,
      );
    });
  } else {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  }
});
