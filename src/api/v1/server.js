/**
 * Created by macdja38 on 2016-09-26.
 */

/* function checkAuth(req, res, next) {
 if (req.isAuthenticated()) return next();
 res.redirect('/');
 return true;
 }*/

/*
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
*/

module.exports = function register(app, db, eris) {
  /*  "/api/v1/prefix/:id"
   *    GET: find server by id
   */
  app.get('/api/v1/server/:id', /* checkServerAuth,*/ (req, res) => {
    console.log(req.params.id);
    const server = eris.guilds.get(req.params.id);
    const serverObject = {
      roles: server.roles.map(role => ({ id: role.id, name: role.name })),
      members: server.members.map(member => ({ id: member.id, name: member.user.username })),
      channels: server.channels.map(channel => ({ id: channel.id, name: channel.name })),
    };
    console.log(serverObject);
    res.json(serverObject);
  });
};
