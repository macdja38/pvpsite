/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { fabric } from 'fabric-webpack';

import Layout from '../../components/Layout';
import s from './Hat.css';

class Hat extends Component {
  static propTypes = {
    user: PropTypes.object,
    userId: PropTypes.string,
    userHash: PropTypes.string,
  };

  constructor({ user, userId, userHash }) {
    super({ user, userId, userHash });
  }

  componentDidMount() {
    let id;
    let hash;
    if (this.props.userId) {
      id = this.props.userId;
    } else if (this.props.user) {
      id = this.props.user.id;
    }

    if (this.props.userHash) {
      hash = this.props.userHash;
    } else if (this.props.user) {
      hash = this.props.user.avatar;
    }

    // const hatURL = 'https://cdn.discordapp.com/attachments/116405078889332743/119653981776642049/hat.png';
    // const avatarURL = `https://discordapp.com/api/users/${id}/avatars/${hash}.jpg`;

    const hatURL = '/api/v1/attachments/116405078889332743/119653981776642049/hat.png';
    const avatarURL = `/api/v1/avatar/${id}/${hash}/`;

    var canvas = new fabric.Canvas("profilePicArea");
    canvas.setHeight(256).setWidth(256).setZoom(2);
    fabric.util.loadImage("${avatarURL}", function(avatarImageElement, error) {
      canvas.setBackgroundImage(new fabric.Image(avatarImageElement), (avatarImage) => {
        canvas.renderAll.call(canvas);
          fabric.util.loadImage("${hatURL}", function(hatImageElement, error) {
            var hatImage = new fabric.Image(hatImageElement).scaleToWidth(100).set({
              angle: 15,
              borderColor: "#2c2f33",
              cornerColor: "#2c2f33",
              cornerSize: 9,
              left: 45,
              top: -35
            })
            canvas.add(hatImage);
          });
      }, {
        width: 128,
        height: 128,
        originX: 0,
        originY: 0
      });
    });
    var downloadButton = document.getElementById("downloadButton");
    downloadButton.addEventListener("click", () => {
      downloadButton.href = canvas.toDataURL({
        format: "jpeg",
        height: 256,
        multiplier: 0.5,
        width: 256
      });
      downloadButton.download = "avatar.jpg";
    }, false);
  }

  render() {
    let id;
    let hash;
    if (this.props.userId) {
      id = this.props.userId;
    } else if (this.props.user) {
      id = this.props.user.id;
    }

    if (this.props.userHash) {
      hash = this.props.userHash;
    } else if (this.props.user) {
      hash = this.props.user.avatar;
    }

    // const hatURL = 'https://cdn.discordapp.com/attachments/116405078889332743/119653981776642049/hat.png';
    // const avatarURL = `https://discordapp.com/api/users/${id}/avatars/${hash}.jpg`;

    const hatURL = '/api/v1/attachments/116405078889332743/119653981776642049/hat.png';
    const avatarURL = `/api/v1/avatar/${id}/${hash}/`;

    return (
      <Layout user={this.props.user}>
        <div className={s.root}>
          <div className={s.container}>
            <h1 className={s.title}>PvPCraft Discord bot.</h1>
            <p>
              <canvas
                id="profilePicArea"
                style={{ position: 'absolute', width: '256px', height: '256px', left: 0, top: 0 }}
                width="256" height="256"
              />
              <input id="downloadButton" type="button" />
            </p>
          </div>
        </div>
      </Layout>
    );
  }
}

export default withStyles(s)(Hat);
