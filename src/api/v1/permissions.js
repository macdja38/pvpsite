/**
 * Created by macdja38 on 2016-07-28.
 */

/* function checkAuth(req, res, next) {
 if (req.isAuthenticated()) return next();
 res.redirect('/');
 return true;
 }*/

function checkServerAuth(req, res, next) {
  const id = req.params.id;
  const guild = req.user.guilds.find(possibleGuild => possibleGuild.id === id);
  if (req.isAuthenticated()
    && guild
    && (guild.permissions & 8 === 0
    || guild.owner)) return next();
  res.sendStatus(403);
  return true;
}


module.exports = function register(app, { r, connPromise }) {
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/permissions/:id', /* checkServerAuth,*/ (req, res) => {
    connPromise.then((conn) => {
      const serverPrefix = r.table('permissions').get(req.params.id).run(conn);
      const defaultPrefix = r.table('permissions').get('*').run(conn);
      Promise.all([serverPrefix, defaultPrefix])
        .then(([serverPrefixResult, defaultPrefixResult]) => {
          const result = {};
          if (serverPrefixResult) {
            result.server = serverPrefixResult;
          } else if (defaultPrefixResult) {
            result.default = defaultPrefixResult;
          }
          res.json(result);
        });
    });
  });

  app.put('/api/v1/permissions/:id', checkServerAuth, (req, res) => {
    connPromise.then((conn) => {
      console.log(req.body); // eslint-disable-line no-console
      const prefix = { prefix: req.body.prefix.split(',').map(pre => pre.trim()), id: req.params.id };
      r.table('permissions').insert(prefix, { conflict: 'update' }).run(conn)
        .then(() => {
          res.json({ success: true });
        })
        .catch(() => {
          res.json({ success: false });
        });
    });
  });

  app.delete('/api/v1/permissions/:id', checkServerAuth, (req, res) => connPromise.then((conn) => {
    const prefix = { prefix: req.body.prefix, id: req.params.id };
    r.table('permissions').insert(prefix, { conflict: 'update' }).run(conn)
      .then(() => {
        res.json({ success: true });
      })
      .catch(() => {
        res.json({ success: false });
      });
  }));
};

