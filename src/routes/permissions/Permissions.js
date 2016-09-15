import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Permissions.css';
import ServerMenu from '../../components/ServerMenu';

function toDivs(permissions, layer = 0) {
  if (typeof(permissions) !== 'object') {
    return permissions;
  }
  return (<div>{
    Object.keys(permissions).map((key, i) => {
      let spanClassName;
      // let liClassName;
      const subNode = toDivs(permissions[key], layer + 1);
      let levelNode;
      switch (layer) {
        case 0:
          levelNode = s.channel;
          break;
        case 1:
          if (key[0] === 'u') {
            levelNode = s.user;
          } else {
            levelNode = s.group;
          }
          break;
        case 2:
          levelNode = cx(s.nodeStart, s.node);
          break;
        default:
          levelNode = s.node;
      }
      if (typeof(subNode) === 'boolean') {
        spanClassName = (subNode === true) ? s.allowed : s.denied;
        // liClassName = s.permissions;
      } else {
        spanClassName = s.entry;
        // liClassName = s.permissionItem;
      }
      return (<div className={cx(spanClassName, levelNode)} key={i}>
        <span >{key}{subNode}</span>
      </div>);
    })
  }</div>);
}

function Permissions({ user, serverId, permissions }, context) {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  try {
    const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
    context.setTitle(guild.name);

    const items = toDivs(permissions.server);

    console.log(permissions);
    return (
      <div>
        <ServerMenu className={s.nav} user={user} serverId={serverId} />
        <div className={s.root}>
          <div className={s.container}>
            <h1 className={s.title}>{guild.name}'s Permissions</h1>
            <div>
              {items}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) { console.error(error); }
}

Permissions.propTypes = {
  user: PropTypes.object,
  serverId: PropTypes.string,
  permissions: PropTypes.object,
};

Permissions.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Permissions);
