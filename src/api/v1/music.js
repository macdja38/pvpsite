/**
 * Created by macdja38 on 2016-07-28.
 */

/* function checkAuth(req, res, next) {
 if (req.isAuthenticated()) return next();
 res.redirect('/');
 return true;
 }*/
import crypto from 'crypto';

function checkServerAuth(req, res, next) {
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

/**
 * Get's the next video(s) in the queue
 * @param {R} r
 * @param {string} id guild id
 * @param {number} [count=1] number of songs to fetch
 * @param {number} [starting=0] index to start at, for pagination etc.
 * @returns {Promise}
 */
function getNextVideos(r, id, count = 1, starting = 0) {
  return r.table('queue').get(id)('queue').default([]).slice(starting, starting + count).run();
}

function getVid(r, hash) {
  return r.table('videoCache').get(hash).run();
}

/**
 * Uses cache to get info for a hashed link
 * @param {R} r
 * @param {string} hashedLink
 * @returns {Promise<Object>}
 */
async function getCachingInfoHash(r, hashedLink) {
  return getVid(r, hashedLink);
}

/**
 * Uses cache to get info for a link
 * @param {R} r
 * @param {string} link
 * @param {Object} [options]
 * @param {boolean} [options.allowOutdated=false]
 * @returns {Promise}
 */
async function getCachingInfoLink(r, link, options = {}) {
  const hashedLink = crypto.createHash('sha256').update(link).digest('hex');
  return getCachingInfoHash(r, hashedLink, link, options);
}

export default function register(app, r) {
  /*  "/api/v1/prefix/:id"
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/music/:id', checkServerAuth, async (req, res) => {
    const queue = await getNextVideos(r, req.params.id, req.params.count || 100, req.params.start || 0);
    const songList = await Promise.all(queue.map(song => getCachingInfoLink(r, song.link, { allowOutdated: true })));
    const joinedList = songList.map((song, i) => {
      // eslint-disable-next-line no-param-reassign
      song.user_id = queue[i].user_id;
      // eslint-disable-next-line no-param-reassign
      song.user_name = queue[i].user_name;
      return song;
    });
    res.json({ queue: joinedList });
  });
}
