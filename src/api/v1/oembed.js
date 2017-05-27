/**
 * Created by macdja38 on 2016-09-22.
 */

import { oauth } from '../../config';
import logoUrl from '../../components/Header/logo-small.png';

export default function register(app) {
  /*  '/api/v1/prefix/:id'
   *    GET: find contact by id
   *    PUT: update contact by id
   *    DELETE: deletes contact by id
   */
  app.get('/api/v1/oembed/', (req, res) => {
    console.log(req.query);
    if (req.query.type === 'video') {
      res.json({
        type: 'video',
        version: '1.0',
        title: req.query.title ? req.query.title : 'PvPCraft',
        author_name: 'macdja38',
        author_url: 'https://youtube.com/macdja38',
        provider_name: 'PvPCraft',
        provider_url: oauth.discord.url,
        thumbnail_url: logoUrl,
        thumbnail_width: 128,
        thumbnail_height: 128,
        cach_age: 1,
        html: '<iframe width="480" height="270" src="https://www.youtube.com/embed/P3eA6tWWjcU?feature=oembed" ' +
        'frameborder="0" allowfullscreen></iframe>',
        width: 480,
        height: 270,
      });
    } else if (req.query.type === 'rich') {
      res.json({
        type: 'rich',
        version: '1.0',
        title: 'PvPCraft',
        author_name: 'macdja38',
        author_url: 'https://youtube.com/macdja38',
        provider_name: 'PvPCraft',
        provider_url: oauth.discord.url,
        thumbnail_url: 'https://discordapp.com/api/users/85257659694993408/' +
        'avatars/7bf8199536c3eba2b29c86027274ab67.jpg',
        thumbnail_width: 128,
        thumbnail_height: 128,
        cach_age: 1,
        html: '<h1>Hi</h1>',
        width: 480,
        height: 270,
      });
    } else {
      res.json({
        type: 'link',
        version: '1.0',
        title: `${
          req.query.title ? req.query.title : 'PvPCraft'
        }${
          req.query.description ? ` - ${req.query.description}` : ''
        }`,
        author_name: 'macdja38',
        author_url: 'https://youtube.com/macdja38',
        provider_name: 'PvPCraft',
        provider_url: oauth.discord.url,
        cach_age: 1,
        thumbnail_url: `${oauth.discord.url}${logoUrl}`,
        thumbnail_width: 128,
        thumbnail_height: 128,
        url: `${oauth.discord.url}${logoUrl}`,
        width: 128,
        height: 128,
      });
    }
  });
}

/*

 */
