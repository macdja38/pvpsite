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

export const oauth = {
  discord: {
    url: process.env.OAUTH_DISCORD_URL || 'http://localhost:3001',
  },
};

export const analytics = {
  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-42652371-11', // UA-XXXXX-X
    embedTrackingId: process.env.EMBED_GOOGLE_TRACKING_ID || 'UA-42652371-10', // UA-XXXXX-X
  },

};

export const sentry = {
  serverDSN: process.env.serverDSN || '',
  clientDSN: process.env.clientDSN || 'https://1bdba2c5d0a3479bb4af538df734cba4@sentry.pvpcraft.ca/4',
};

export const auth = {

  // https://discordapp.com/developers
  discord: {
    id: process.env.DISCORD_CLIENT_ID || '168673089138196480',
    shards: process.env.DISCORD_CLIENT_SHARDS || '1',
    secret: process.env.DISCORD_CLIENT_SECRET || '',
    token: process.env.DISCORD_CLIENT_TOKEN || '',
  },

  pvpApi: {
    endpoint: process.env.PVPAPI_CLIENT_ENDPOINT || 'https://api.pvpcraft.ca',
    id: process.env.DISCORD_CLIENT_ID || '157914012892397568',
    token: process.env.PVPAPI_CLIENT_TOKEN || '',
  },

};

export const database = {
  reThinkDB: {
    host: process.env.RETHINKDB_HOST || 'localhost',
    port: process.env.RETHINKDB_PORT || '28015',
    db: process.env.RETHINKDB_DB || 'pvpcraft',
    buffer: parseInt(process.env.RETHINKDB_BUFFER || '10', 10),
  },
};
