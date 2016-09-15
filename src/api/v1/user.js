/**
 * Created by macdja38 on 2016-08-05.
 */

/* function checkAuth(req, res, next) {
 if (req.isAuthenticated()) return next();
 res.redirect('/');
 return true;
 }*/

function checkServerAuth(req, res, next) {
  if (req.isAuthenticated() && req.params.id === req.user.id) return next();
  res.sendStatus(403);
  return true;
}

function checkUser(req, res, next) {
  if (req.isAuthenticated() && req.user.id) return next();
  res.status(403).send("User not Authenticated");
  return true;
}

module.exports = function register(app, { r, connPromise }) {
  app.get('/api/v1/user/', checkUser, (req, res) => {
    console.log("Got user request");
    if (req.user) { res.json(req.user); console.log(req.user.username); }
    else res.status(404).send('User not Cached');
  });

  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/user/:id', checkServerAuth, (req, res) => {
    if (req.user) res.json(req.user);
    else {
      connPromise.then((conn) => r
        .table('users').get(req.params.id)
        .then(user => {
          res.json(user);
        })
      );
    }
  });

  app.put('/api/v1/user/:id', checkServerAuth, (req, res) => {
    connPromise.then((conn) => {
      const prefix = { prefix: req.body.prefix, id: req.params.id };
      r.table('servers').insert(prefix, { conflict: 'update' }).run(conn)
        .then(() => {
          res.json({ success: true });
        })
        .catch(() => {
          res.json({ success: false });
        });
    });
  });

  app.delete('/api/v1/user/:id', checkServerAuth, (req, res) => connPromise.then((conn) => {
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

