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
    if (guild && ((guild.permissions & 8) === 8 || guild.owner)) return next(); // eslint-disable-line no-bitwise
  }
  res.sendStatus(403);
  return true;
}


module.exports = function register(app, { r, connPromise }) {
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/prefix/:id', checkServerAuth, (req, res) => {
    connPromise.then((conn) => {
      const serverPrefix = r.table('servers').get(req.params.id).run(conn);
      const defaultPrefix = r.table('servers').get('*').run(conn);
      Promise.all([serverPrefix, defaultPrefix])
        .then(([serverPrefixResult, defaultPrefixResult]) => {
          if (serverPrefixResult && serverPrefixResult.hasOwnProperty('prefix')) { // eslint-disable-line
            res.json(serverPrefixResult);
          } else if (defaultPrefixResult && defaultPrefixResult.hasOwnProperty('prefix')) { // eslint-disable-line
            res.json(defaultPrefixResult);
          } else {
            res.json({ prefix: [] });
          }
        }).catch(error => console.error(error));
    });
  });

  app.put('/api/v1/prefix/:id', checkServerAuth, (req, res) => {
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
};

