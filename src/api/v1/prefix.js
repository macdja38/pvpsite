/**
 * Created by macdja38 on 2016-07-28.
 */

/* function checkAuth(req, res, next) {
 if (req.isAuthenticated()) return next();
 res.redirect('/');
 return true;
 }*/

function checkServerAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
  return true;
}


module.exports = function register(app, { r, connPromise }) {
  /*  "/api/v1/prefix"
   *    GET: finds all contacts
   *    POST: creates a new contact
   */
  /*
   app.get('/api/v1/prefix', checkAuth, (req, res) => {

   });

   app.post('/api/v1/prefix', checkAuth, (req, res)=>{

   });
   */
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/prefix/:id', /* checkServerAuth,*/ (req, res) => {
    console.log('Api request received.');
    connPromise.then((conn) => {
      const serverPrefix = r.table('servers').get(req.params.id).run(conn);
      const defaultPrefix = r.table('servers').get('*').run(conn);
      Promise.all([serverPrefix, defaultPrefix])
        .then(([serverPrefixResult, defaultPrefixResult]) => {
          console.log(serverPrefixResult);
          console.log(defaultPrefixResult);
          if (serverPrefixResult && serverPrefixResult.hasOwnProperty('prefix')) {
            res.json(serverPrefixResult);
          } else {
            res.json(defaultPrefixResult);
          }
        });
    });
  });

  app.put('/api/v1/prefix/:id', checkServerAuth, (req, res) => {
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

