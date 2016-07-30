/**
 * Created by macdja38 on 2016-07-28.
 */


module.exports = function register(app, {r, conn}) {

    /*  "/api/v1/prefix"
     *    GET: finds all contacts
     *    POST: creates a new contact
     */
    app.get("/api/v1/prefix", checkAuth, function(req, res) {

    });

    app.post("/api/v1/prefix", checkAuth, function(req, res) {

    });

    /*  "/api/v1/prefix/:id"
     *    GET: find contact by id
     *    PUT: update contact by id
     *    DELETE: deletes contact by id
     */
    app.get("/api/v1/prefix/:id", checkServerAuth, function(req, res) {
      conn.then((conn)=> {
        let serverPrefix = r.table('servers').get(req.params.id).run(conn);
        let defaultPrefix = r.table('servers').get("*").run(conn);
        Promise.all([serverPrefix, defaultPrefix]).then(([serverPrefix, defaultPrefix])=>{
          if(serverPrefix.prefix) {
            res.json(serverPrefix.prefix);
          } else {
            res.json(defaultPrefix.prefix);
          }
        })
      });
    });

    app.put("/api/v1/prefix/:id", checkServerAuth, function(req, res) {
      conn.then((conn)=> {
        console.log(req.body);
        req.id = req.params.id;
        let prefix = {prefix: req.body.prefix, id: req.params.id};
        r.table('servers').insert(prefix, {conflict: "update"}).run(conn).then(()=>{
          res.json({success: true});
        }).catch(()=>{
          res.json({success: false})
        });
      });
    });

    app.delete("/api/v1/prefix/:id", checkServerAuth, function(req, res) {
      conn.then((conn)=> {
        console.log(req.body);
        req.id = req.params.id;
        let prefix = {prefix: req.body.prefix, id: req.params.id};
        r.table('servers').insert(prefix, {conflict: "update"}).run(conn).then(()=>{
          res.json({success: true});
        }).catch(()=>{
          res.json({success: false})
        });
      });
    });
};

function checkServerAuth(req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
