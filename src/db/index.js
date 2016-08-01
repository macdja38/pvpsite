/**
 * Created by macdja38 on 2016-07-25.
 */

const r = require('rethinkdb');
require('rethinkdb-init')(r);

r.connections = [];
r.getNewConnection = () => r.connect('localhost')
  .then(conn => {
    conn.use('auth');
    r.connections.push(conn);
    return conn;
  });

r.init(null, [
  {
    name: 'users',
    indexes: ['login'],
  },
]).then(conn => {
  r.conn = conn;
  r.connections.push(conn);
  r.conn.use('auth');
});

module.exports = r;
