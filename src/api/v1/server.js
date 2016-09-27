/**
 * Created by macdja38 on 2016-09-26.
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
    && ((guild.permissions & 8) === 8
    || guild.owner)) return next();
  res.sendStatus(403);
  return true;
}


module.exports = function register(app, { r, connPromise }, eris) {
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/server/:id', /* checkServerAuth,*/ (req, res) => {
    console.log(req.params.id);
    console.log(eris);
    console.log(eris.guilds);
    const server = eris.guilds.get(req.params.id);
    console.log(server);
    const serverObject = {
      roles: roles.map(r => ({id: r.id, })),
    };
    console.log(JSON.stringify(server));
    res.json(JSON.stringify(server));
  });

  app.put('/api/v1/server/:id', checkServerAuth, (req, res) => {
    connPromise.then((conn) => {
      console.log(req.body); // eslint-disable-line no-console
      const prefix = { prefix: req.body.prefix.split(',').map(pre => pre.trim()), id: req.params.id };
      r.table('server').insert(prefix, { conflict: 'update' }).run(conn)
      .then(() => {
        res.json({ success: true });
      })
      .catch(() => {
        res.json({ success: false });
      });
    });
  });

  app.delete('/api/v1/server/:id', checkServerAuth, (req, res) => connPromise.then((conn) => {
    const prefix = { prefix: req.body.prefix, id: req.params.id };
    r.table('server').insert(prefix, { conflict: 'update' }).run(conn)
    .then(() => {
      res.json({ success: true });
    })
    .catch(() => {
      res.json({ success: false });
    });
  }));
};
