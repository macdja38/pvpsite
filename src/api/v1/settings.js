/**
 * Created by macdja38 on 2016-07-28.
 */

/* function checkAuth(req, res, next) {
 if (req.isAuthenticated()) return next();
 res.redirect('/');
 return true;
 }*/

function checkOnServer(req, res, next) {
  if (req.isAuthenticated()) {
    const id = req.params.guildId;
    const guild = req.user.guilds.find(possibleGuild => possibleGuild.id === id);
    if (guild) {
      return next();
    }
  }
  res.sendStatus(403);
  return true;
}

function checkServerAuth(req, res, next) {
  if (req.isAuthenticated()) {
    const id = req.params.guildId;
    const guild = req.user.guilds.find(possibleGuild => possibleGuild.id === id);
    if (guild && ((guild.permissions & 8) === 8 || guild.owner)) return next(); // eslint-disable-line no-bitwise
  }
  res.sendStatus(403);
  return true;
}

module.exports = function register(app, { r }) {
  app.get('/api/v1/settingsMap/bot/:botId/guild/:guildId', checkOnServer, (req, res) => {
    const guildSpecificPromise = r
      .table('settingsMap')
      .get(`${req.params.botId}|${req.params.guildId}`)
      .run();

    const botGlobalPromise = r
      .table('settingsMap')
      .get(`${req.params.botId}|*`)
      .run();

    botGlobalPromise.then(botGlobal => {
      guildSpecificPromise.then(guildSpecific => {
        res.json(guildSpecific || botGlobal);
      });
    });

    botGlobalPromise.catch(() => {
      res.sendStatus(404);
    });
    guildSpecificPromise.catch(() => {
      res.sendStatus(404);
    });
  });

  app.get('/api/v1/settings/bot/:botId/guild/:guildId', checkOnServer, (req, res) => {
    r
      .table('settings')
      .get(`${req.params.botId}|${req.params.guildId}`)
      .run()
      .then(c => res.json(c));
  });

  app.put('/api/v1/settings/bot/:botId/guild/:guildId', checkServerAuth, (req, res) => {
    const body = req.body;
    body.id = `${req.params.botId}|${req.params.guildId}`;
    console.log('put', body);
    r
      .table('settings')
      .insert(body, { conflict: 'update' })
      .run()
      .then(c => { console.log(c); return res.json(c); });
  });

  app.patch('/api/v1/settings/bot/:botId/guild/:guildId', checkServerAuth, (req, res) => {
    const body = req.body;
    body.id = `${req.params.botId}|${req.params.guildId}`;
    console.log('patch', body);
    r
      .table('settings')
      .insert(body, { conflict: 'update' })
      .run()
      .then(c => res.json(c));
  });

  app.delete('/api/v1/settings/bot/:botId/guild/:guildId', checkServerAuth, (req, res) => {
    r
      .table('settings')
      .delete(`${req.params.botId}|${req.params.guildId}`)
      .run()
      .then(c => res.json(c));
  });
};

