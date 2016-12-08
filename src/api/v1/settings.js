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

/* const settingsMap = {
  ranks: {
    deleteAfter: {
      type: 'boolean',
      name: 'delete after input',
      description: 'Deletes the users input after running a command and deletes the bot\'s response after a delay',
    },
    deleteDelay: {
      type: 'int',
      name: 'delete delay (seconds)',
      description: 'How long after the command is executed should the input be deleted (seconds)',
    },
    joinableRanks: {
      type: 'list',
      name: 'delete delay (seconds)',
      description: 'How long after the command is executed should the input be deleted (seconds)',
    },
  },
}; */


module.exports = function register(app, { r, connPromise }) {
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/settings/:id', checkServerAuth, (req, res) => {
    connPromise.then((conn) => {
      const queue = r.table('servers').get(req.params.id).run(conn);
      Promise.all([queue])
        .then(([queueResult]) => {
          if (queueResult && queueResult.hasOwnProperty('queue')) { // eslint-disable-line no-prototype-builtins
            res.json(queueResult);
          } else {
            res.json({ queue: [] });
          }
        }).catch(error => console.error(error));
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

