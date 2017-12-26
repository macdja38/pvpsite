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

export default function register(app, r) {
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/permissions/:id', /* checkServerAuth, */ (req, res) => {
    const serverPermissions = r.table('permissions').get(req.params.id).run();
    const defaultPermissions = r.table('permissions').get('*').run();
    Promise.all([serverPermissions, defaultPermissions])
      .then(([serverPermissionsResult, defaultPermissionsResult]) => {
        const result = {};
        if (serverPermissionsResult === null) {
          result.server = { id: req.params.id };
        } else if (serverPermissionsResult) {
          result.server = serverPermissionsResult;
        }
        if (defaultPermissionsResult) {
          result.default = defaultPermissionsResult;
        }
        res.json(result);
      }).catch(error => console.error(error));
  });

  app.put('/api/v1/permissions/:id', checkServerAuth, (req, res) => {
    console.log(req.body); // eslint-disable-line no-console
    const data = req.body;
    data.id = req.params.id;
    r.table('permissions').insert(data, { conflict: 'replace' }).run()
      .then(() => {
        res.json({ success: true });
      })
      .catch((error) => {
        console.error(error);
        res.json({ success: false });
      });
  });

  app.delete('/api/v1/permissions/:id', checkServerAuth, (req, res) => {
    const prefix = { prefix: req.body.prefix, id: req.params.id };
    r.table('permissions').insert(prefix, { conflict: 'update' }).run()
      .then(() => {
        res.json({ success: true });
      })
      .catch(() => {
        res.json({ success: false });
      });
  });
}
