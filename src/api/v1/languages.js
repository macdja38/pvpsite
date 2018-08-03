/**
 * Created by macdja38 on 2018-07-07.
 */

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    const id = req.params.id;
    const guild = req.user.guilds.find(possibleGuild => possibleGuild.id === id);
    if (guild) {
      return next();
    }
  }
  res.sendStatus(403);
  return true;
}

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
  app.get('/api/v1/languages/:id', checkAuth, (req, res) => {
    r.table('servers').get(req.params.id)('languages')
      .default(r.table('servers').get('*')('languages'))
      .default({ '*': 'en' })
      .run()
      .then(res.json.bind(res))
      .catch(error => {
        console.log('The error is ', error);
        res.status(500).send('sorry, the request could not be completed');
        console.error(error);
      });
  });

  app.put('/api/v1/languages/:id', checkServerAuth, (req, res) => {
    const languages = Object.entries(req.body)
      .filter(([key, value]) => {
        if (typeof value !== 'string') {
          return false;
        }
        return true;
      }).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    console.log(req.params.id, languages);

    r.table('servers').get(req.params.id)
      .replace((config) => config.default({ id: req.params.id }).without('languages').merge({ languages }))
      .run()
      .then(() => {
        res.json({ success: true });
      })
      .catch(() => {
        res.json({ success: false });
      });
  });

  app.delete('/api/v1/languages/:id', checkServerAuth, (req, res) => {
    r.table('servers').get(req.params.id)
      .replace((config) => config.without('languages'))
      .run()
      .then(() => {
        res.json({ success: true });
      })
      .catch(() => {
        res.json({ success: false });
      });
  });
}
