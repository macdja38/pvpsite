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
    url: process.env.OAUTH_DISCORD_URL || 'https://bot.pvpcraft.ca',
  },
};

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-42652371-11', // UA-XXXXX-X
    embedTrackingId: process.env.EMBED_GOOGLE_TRACKING_ID || 'UA-42652371-10',
  },

};

export const sentry = {
  clientDSN: process.env.clientDSN || 'https://1bdba2c5d0a3479bb4af538df734cba4@sentry.pvpcraft.ca/4',
};

export const auth = {

  // https://discordapp.com/developers
  discord: {
    id: process.env.DISCORD_CLIENT_ID || '168133784078647296',
  },

};
