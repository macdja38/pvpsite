/**
 * Created by macdja38 on 2017-07-06.
 */

import React from 'react';
import Channels from './Channels';

const title = 'Server';
const description = 'Server';

function action({ user }, { channelId, guildId }) {
  if (!user) {
    if (channelId && guildId) {
      return { redirect: `/login/channels/${guildId}/${channelId}` };
    }
    return { redirect: '/login/channels/' };
  }

  return {
    chunks: ['channels'],
    title,
    description,
    component: <Channels user={user} channelId={channelId} guildId={guildId} />,
  };
}

export default action;
