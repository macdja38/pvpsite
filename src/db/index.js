/**
 * Created by macdja38 on 2016-07-25.
 */
import { database } from '../config.js';

const r = require('rethinkdb');
require('rethinkdb-init')(r);

r.connections = [];
r.getNewConnection = () => r.connect(database.reThinkDB)
  .then(conn => {
    conn.use(database.reThinkDB.db);
    r.connections.push(conn);
    return conn;
  });

r.init(database.reThinkDB, [
  {
    name: 'users',
    indexes: ['login'],
  },
]).then(conn => {
  r.conn = conn;
  r.connections.push(conn);
  r.conn.use(database.reThinkDB.db);
});

module.exports = r;
