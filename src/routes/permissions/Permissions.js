import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Permissions.css';
import ServerMenu from '../../components/ServerMenu';

function toDivs(permissions, serverData, layer = 0) {
  if (typeof(permissions) !== 'object') {
    return permissions;
  }
  return (<div>{
    Object.keys(permissions).map((key, i) => {
      let label = key;
      let spanClassName;
      // let liClassName;
      const subNode = toDivs(permissions[key], serverData, layer + 1);
      let levelNode;
      switch (layer) {
        case 0:
          levelNode = s.channel;
          if (serverData && serverData.hasOwnProperty('channels') && key !== '*') {
            const channel = serverData.channels.find(c => c.id === key);
            if (channel && channel.hasOwnProperty('name')) {
              label = `#${channel.name}`;
            }
          }
          break;
        case 1:
          if (key[0] === 'u') {
            levelNode = s.user;
            if (serverData && serverData.hasOwnProperty('members') && key !== '*') {
              const userId = key.slice(1);
              const user = serverData.members.find(m => m.id === userId);
              if (user && user.hasOwnProperty('name')) {
                label = `User: ${user.name}`;
              }
            }
          } else {
            levelNode = s.group;
            if (serverData && serverData.hasOwnProperty('roles') && key !== '*') {
              const groupId = key.slice(1);
              const group = serverData.roles.find(g => g.id === groupId);
              if (group && group.hasOwnProperty('name')) {
                label = `Role: ${group.name}`;
              }
            }
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
      return (<div className={cx(spanClassName, levelNode)} key={i}>{label}{subNode}</div>);
    })
  }</div>);
}

function Permissions({ user, serverId, permissions, serverData }, context) {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  console.log(serverData);
  try {
    const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
    context.setTitle(guild.name);

    const items = toDivs(permissions.server, serverData);

    const clickHandler = function clickHandler(...args) {
      console.log(args);
      console.log(this);
    };

    return (
      <div>
        <ServerMenu className={s.nav} user={user} serverId={serverId} page="permissions" />
        <div className={s.root}>
          <div className={s.container}>
            <h1 className={s.title}>{guild.name}'s Permissions</h1>
            <div onClick={clickHandler}>
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
  serverData: PropTypes.object,
  permissions: PropTypes.object,
};

Permissions.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Permissions);
