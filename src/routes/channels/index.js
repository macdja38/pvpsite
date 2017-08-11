/**
 * Created by macdja38 on 2017-07-06.
 */

import React from 'react';
import Channels from './Channels';

const title = 'Server';
const description = 'Server';

async function action({ user, fetch }, { guildId, channelId }) {
  if (!user) {
    if (guildId && channelId) {
      return { redirect: `/login/channels/${guildId}/${channelId}` };
    }
    return { redirect: '/login/channels/' };
  }

  let guildData;
  if (user && guildId) {
    const guildDataResp = await fetch(`/api/v1/guild/${guildId}`, {
      method: 'GET',
    });
    console.info(guildDataResp);
    if (guildDataResp.status === 200) {
      // console.log(await guildDataResp.text());
      guildData = await guildDataResp.json();
    } else {
      // return { redirect: 'https://invite.pvpcraft.ca' };
    }
  }

  return {
    chunks: ['channels'],
    title,
    description,
    component: <Channels user={user} channelId={channelId} guildId={guildId} guildData={guildData} />,
  };
}

export default action;
