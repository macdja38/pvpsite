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
    const id = req.params.id;
    const guild = req.user.guilds.find(possibleGuild => possibleGuild.id === id);
    if (guild) {
      return next();
    }
  }
  res.sendStatus(403);
  return true;
}

const settingsMap = {
  layout: [
    {
      type: 'category',
      name: 'ranks',
      key: 'ranks',
      description: 'joinable ranks',
      children: [
        {
          type: 'boolean',
          name: 'delete after input',
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
  ],
};


module.exports = function register(app, { r, connPromise }) {
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/settings/:id', checkServerAuth, (req, res) => {
    connPromise.then((/* conn */) => {
      res.json(settingsMap);
      /* const queue = r.table('servers').get(req.params.id).run(conn);
      Promise.all([queue])
        .then(([queueResult]) => {
          if (queueResult && queueResult.hasOwnProperty('queue')) { // eslint-disable-line no-prototype-builtins
            res.json(queueResult);
          } else {
            res.json({ queue: [] });
          }
        }).catch(error => console.error(error));*/
    });
  });

  /* app.put('/api/v1/prefix/:id', checkServerAuth, (req, res) => {
    connPromise.then((conn) => {
      const prefix = { prefix: req.body.prefix.split(',').map(pre => pre.trim()), id: req.params.id };
      r.table('servers').insert(prefix, { conflict: 'update' }).run(conn)
        .then(() => {
          res.json({ success: true });
        })
        .catch(() => {
          res.json({ success: false });
        });
    });
  });

  app.delete('/api/v1/prefix/:id', checkServerAuth, (req, res) => connPromise.then((conn) => {
    const prefix = { prefix: req.body.prefix, id: req.params.id };
    r.table('servers').insert(prefix, { conflict: 'update' }).run(conn)
      .then(() => {
        res.json({ success: true });
      })
      .catch(() => {
        res.json({ success: false });
      });
  }));
  */
};

