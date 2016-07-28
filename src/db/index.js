/**
 * Created by macdja38 on 2016-07-25.
 */
'use strict';

var r = require('rethinkdb');
require('rethinkdb-init')(r);

r.connections = [];
r.getNewConnection = function () {
  return r.connect('localhost')
    .then(function (conn) {
      conn.use('auth');
      r.connections.push(conn);
      return conn;
    });
};

r.init(config.get('rethinkdb'), [
  {
    name: 'users',
    indexes: ['login']
  }
]).then(function (conn) {
  r.conn = conn;
  r.connections.push(conn);
  r.conn.use('auth');
});

module.exports = r;
