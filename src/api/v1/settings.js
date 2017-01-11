/**
 * Created by macdja38 on 2016-07-28.
 */

/* function checkAuth(req, res, next) {
 if (req.isAuthenticated()) return next();
 res.redirect('/');
 return true;
 }*/

function checkServerAuth(req, res, next) {
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

const settingsMap = {
  type: 'pageSelector',
  children: {
    ranks: {
      type: 'category',
      name: 'ranks',
      key: 'ranks',
      description: 'joinable ranks',
      children: [
        {
          type: 'boolean',
          name: 'delete after input for ranks',
          key: 'deleteAfter',
          default: false,
          description: 'Deletes the users input after running a command and deletes the bot\'s response after a delay',
        },
        {
          type: 'int',
          name: 'delete delay (seconds)',
          key: 'deleteDelay',
          default: 0,
          description: 'How long after the command is executed should the input be deleted (seconds)',
        },
        {
          type: 'list',
          name: 'delete delay (seconds)',
          key: 'joinableRanks',
          default: [],
          content: {
            type: 'role',
          },
          description: 'list of ranks that should be excusive',
        },
        {
          type: 'boolean',
          key: 'exclusive',
          name: 'exclusive',
          default: false,
          description: 'yea... this is obvious',
        },
      ],
    },
    cats: {
      type: 'category',
      name: 'cats',
      key: 'cats',
      description: 'cat provider',
      children: [
        {
          type: 'boolean',
          name: 'delete after input for cats',
          key: 'deleteAfter',
          default: false,
          description: 'Deletes the users input after running a command and deletes the bot\'s response after a delay',
        },
        {
          type: 'int',
          name: 'delete delay (seconds)',
          key: 'deleteDelay',
          default: 0,
          description: 'How long after the command is executed should the input be deleted (seconds)',
        },
        {
          type: 'list',
          name: 'delete delay (seconds)',
          key: 'joinableRanks',
          default: [],
          description: 'list of ranks that should be excusive',
        },
        {
          type: 'boolean',
          key: 'exclusive',
          name: 'exclusive',
          default: false,
          description: 'yea... this is obvious',
        },
      ],
    },
  },
};


module.exports = function register(app, { r }) {
  app.get('/api/v1/settingsMap/bot/:botId/guild/:guildId', checkServerAuth, (req, res) => {
    r
      .table('settingsMap')
      .get(`${req.params.botId}|${req.params.guildId}`)
      .run()
      .then(c => res.json(c));
  });

  app.get('/api/v1/settings/bot/:botId/guild/:guildId', checkServerAuth, (req, res) => {
    r
      .table('settings')
      .get(`${req.params.botId}|${req.params.guildId}`)
      .run()
      .then(c => res.json(c));
  });

  app.put('/api/v1/settings/bot/:botId/guild/:guildId', checkServerAuth, (req, res) => {
    const body = req.body;
    body.id = `${req.params.botId}|${req.params.guildId}`;
    r
      .table('settings')
      .get(`${req.params.botId}|${req.params.guildId}`)
      .run()
      .then(c => res.json(c));
  });

  app.patch('/api/v1/settings/bot/:botId/guild/:guildId', checkServerAuth, (req, res) => {
    const body = req.body;
    body.id = `${req.params.botId}|${req.params.guildId}`;
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

