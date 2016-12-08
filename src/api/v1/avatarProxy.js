/**
 * Created by macdja38 on 2016-11-15.
 */

import request from 'request';

module.exports = function register(app) {
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/avatar/:id/:hash', /* checkServerAuth,*/ (req, res) => {
    console.log(`https://cdn.discordapp.com/avatars/${req.params.id}/${req.params.hash}.jpg`);
    request(`https://cdn.discordapp.com/avatars/${req.params.id}/${req.params.hash}.jpg`).pipe(res);
  });

  app.get('/api/v1/attachments/:id/:hash/:filename', /* checkServerAuth,*/ (req, res) => {
    request(`https://cdn.discordapp.com/attachments/${
      req.params.id}/${req.params.hash}/${req.params.filename}`)
    .pipe(res);
  });
};
