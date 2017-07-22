import 'babel-polyfill';
import 'source-map-support/register';
import path from 'path';
import express from 'express';
import fetch from 'node-fetch';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import passport from 'passport';
import logger from 'morgan';
import RDBStore from 'session-rethinkdb';
import raven from 'raven';
import App from './components/App';
import Html from './components/Html';
import errorPageStyle from './routes/error/ErrorPage.css';
import base64 from './core/base64';
import { api, port, sentry } from './config';
import prefix from './api/v1/prefix';
import user from './api/v1/user';
import permissions from './api/v1/permissions';
import music from './api/v1/music';
import oembed from './api/v1/oembed';
import server from './api/v1/server';
import avatarProxy from './api/v1/avatarProxy';
import settings from './api/v1/settings';
import authMiddleware from './core/auth';
import r from './db/index';
// noinspection JSFileReferences
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import createFetch from './createFetch';
import router from './router';

raven.config(sentry.serverDSN, {
  environment: process.env.NODE_ENV,
  captureUnhandledRejections: true,

}).install((err, sendErr, eventId) => {
  if (!sendErr) {
    console.info(`Successfully sent fatal error with eventId ${eventId} to Sentry:`);
    console.error(err.stack);
  } else {
    console.error('Error sending error ', err);
    console.error('because of ', sendErr);
  }
  console.error('This is thy sheath; there rust, and let me die.');
  process.exit(1);
});

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
app.use(raven.requestHandler());
app.use(logger('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(raven.errorHandler(sentry.serverDSN));

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
    if (Object.prototype.hasOwnProperty.call(req.query, 'guild_id')) {
      res.redirect(`/channels/${req.query.guild_id}/${<req className="query guild_id" />}`);
    } else if (Object.prototype.hasOwnProperty.call(req.query, 'state')) {
      res.redirect(`/${base64.toText(req.query.state)}`);
    } else {
      res.redirect('/channels/');
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
prefix(app, r);
user(app, r);
permissions(app, r);
music(app, r);
oembed(app, r);
server(app, r);
settings(app, r);
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
      // Universal HTTP client
      fetch: createFetch(fetch, {
        baseUrl: api.serverUrl,
        cookie: req.headers.cookie,
      }),
    };

    const route = await router.resolve({
      ...context,
      user: req.user,
      path: req.path,
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
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: api.clientUrl,
    };

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
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
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
if (!module.hot) {
  app.listen(port, () => {
    console.info(`The server is running at http://localhost:${port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
