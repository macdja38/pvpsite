/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';

export const oauth = {
  discord: {
    url: process.env.OAUTH_DISCORD_URL || 'http://localhost:3001',
  },
};

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

};

export const sentry = {
  serverDSN: process.env.serverDSN || '',
  clientDSN: process.env.clientDSN || '',
};

export const auth = {

  // https://discordapp.com/developers
  discord: {
    id: process.env.DISCORD_CLIENT_ID || '',
    shards: process.env.DISCORD_CLIENT_SHARDS || '1',
    secret: process.env.DISCORD_CLIENT_SECRET || '',
    token: process.env.DISCORD_CLIENT_TOKEN || '',
  },

};

export const database = {
  reThinkDB: {
    host: process.env.RETHINKDB_HOST || 'localhost',
    port: process.env.RETHINKDB_PORT || '28015',
    db: process.env.RETHINKDB_DB || 'tau',
  },
};
