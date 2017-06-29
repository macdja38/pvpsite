/**
 * Created by macdja38 on 2016-09-26.
 */

import fetch from '../../core/fetch/fetch.server';
import { auth } from '../../config';

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
  return true;
}

/*
function checkServerAuth(req, res, next) {
  const id = req.params.id;
  const guild = req.user.guilds.find(possibleGuild => possibleGuild.id === id);
  if (req.isAuthenticated()
    && guild
    && ((guild.permissions & 8) === 8
    || guild.owner)) return next();
  res.sendStatus(403);
  return true;
}
*/

export default function register(app) {
  /* app.get('/api/v1/servers/', checkAuth, (req, res) => {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
      return;
    }
    res.json(req.user.guilds.filter(g => eris.guilds.has(g.id)));
  });*/

  /*  "/api/v1/prefix/:id"
   *    GET: find server by id
   */
  app.get('/api/v1/server/:id', checkAuth, (req, res) => {
    fetch(`http://localhost:3032/v1/server/${req.params.id}`, {
      headers: {
        id: auth.pvpApi.id,
        token: auth.pvpApi.token,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(data => {
          res.json(data.data);
        }).catch(() => res.status(500).send('error'));
      } else {
        res.status(response.status).send(response.message);
      }
    }).catch(() => res.status(500).send('other error'));
  });


    /* const server = eris.guilds.get(req.params.id);
    if (!server) return res.sendStatus(404);
    const serverObject = {
      roles: server.roles.map(role => ({ id: role.id, name: role.name })),
      members: server.members.map(member => ({ id: member.id, name: member.user.username })),
      channels: server.channels.map(channel => ({ id: channel.id, name: channel.name, type: channel.type })),
    };
    return res.json(serverObject);
  }); */
};
