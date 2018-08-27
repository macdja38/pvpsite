import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Languages.css';
import ServerMenu from '../../components/ServerMenu';
import Layout from '../../components/Layout';
import Selector from '../../components/Selector';
import fetch from '../../core/fetch';

const languageMap = {
  en: 'English',
  de: 'German',
};

class Languages extends Component {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  static propTypes = {
    user: PropTypes.object.isRequired,
    serverId: PropTypes.string.isRequired,
    serverData: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    guild: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.channelCallback = this.channelCallback.bind(this);
    this.languageCallback = this.languageCallback.bind(this);
    this.removeChannelConfig = this.removeChannelConfig.bind(this);
    this.addChannelOverride = this.addChannelOverride.bind(this);
    this.state = { languages: this.props.languages };

    this.state.canEdit = props.guild.owner || (props.guild.permissions & 8) === 8; // eslint-disable-line no-bitwise
  }

  toDivs(languages) {
    return (
      <table>
        <thead>
        <tr>
          <th>
            Channel
          </th>
          <th>
            Language
          </th>
          <th>
            Remove
          </th>
        </tr>
        </thead>
        <tbody>{
          Object.entries(languages).map(([channelID, languageID]) => (
            <tr key={channelID}>
              <td>
                {(this.props.serverData.channels.find(channel => channel.id === channelID)
                  || { name: channelID === '*' ? 'All' : channelID }).name}
              </td>
              <td>
                {languageMap[languageID]}
              </td>
              <td>
                <button onClick={this.removeChannelConfig.bind(this, channelID)}>
                  remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  applyPermissionsChange(languages) {
    fetch(`/api/v1/languages/${this.props.serverId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(languages),
    }).then((...args) => {
      this.setState({ languages });
      console.log(...args);
    }).catch(error => {
      console.log(error);
      alert(error.toString());
    });
  }

  addChannelOverride() {
    const newLanguages = Object.assign({}, this.state.languages, { [this.currentChannel.id]: this.currentLanguage.id });
    this.applyPermissionsChange(newLanguages);
  }

  removeChannelConfig(channelID) {
    const newLanguages = Object.assign({}, this.state.languages);
    delete newLanguages[channelID];
    this.applyPermissionsChange(newLanguages);
  }

  languageCallback(language) {
    console.log(language);
    this.currentLanguage = language;
  }

  channelCallback(channel) {
    console.log(channel);
    this.currentChannel = channel;
  }

  render() {
    const { user, serverId, serverData, title } = this.props;

    const items = this.toDivs(this.state.languages, serverData);

    if (serverData.channels) {
      const channels = [{ id: '*', name: 'All' }];
      channels.push(...serverData.channels
        .filter(c => c.type === 0)
        .map(c => ({ id: c.id, name: c.type === 0 ? `# ${c.name}` : c.name })));

      const languages = Object.entries(languageMap).map(([languageID, languageName]) => ({
        id: languageID,
        name: languageName,
      }));

      this.channelSelector = (
        <Selector
          placeHolder="channels" label={'Channels'} callback={this.channelCallback} items={channels}
        />);
      this.languageSelector = (
        <Selector
          placeHolder="languages" label={'Languages'} callback={this.languageCallback} items={languages}
        />);
    }

    return (
      <Layout user={user}>
        <div>
          <ServerMenu className={s.nav} user={user} serverId={serverId} page="languages" />
          <div className={s.container}>
            <h1 className={s.title}>{title}</h1>
            <div className={s.root}>
              {this.state.canEdit && <div>
                <div style={{ float: 'left' }}>
                  {this.channelSelector}
                  {this.languageSelector}
                  <div style={{ display: 'inline-block' }}>
                    <span><label htmlFor="add-channel-override-button">Add Override</label><br /></span>
                    <button
                      id="add-channel-override-button"
                      className={s.button}
                      onClick={this.addChannelOverride}
                    >
                      Add Channel Override
                    </button>
                  </div>
                  <br />
                </div>
                <div className={s.clearFix} />
              </div>
              }
              {items}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default withStyles(s)(Languages);
