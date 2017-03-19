/**
 * Created by macdja38 on 2016-07-25.
 */
import { database } from '../config.js';

const r = require('rethinkdbdash')(database.reThinkDB);
require('rethinkdb-init')(r);

r.init(database.reThinkDB, [
  {
    name: 'users',
    indexes: ['login'],
  },
]);

export default r;
