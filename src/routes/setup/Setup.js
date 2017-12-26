import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import CheckBox from '../../components/Inputs/Checkbox';

import s from './Setup.css';

import Layout from '../../components/Layout';

class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pages: {
        1: { name: 'music', enabled: false, exec: this.musicPage },
        2: { name: 'warframe', enabled: false },
        3: { name: 'chess', enabled: false },
        4: { name: 'moderation log', enabled: false },
      },
    };
  }

  getPage() {
    if (this.state.page === 0) {
      return this.introPage();
    } else if (this.state.pages.hasOwnProperty(this.state.page)) {
      return this.state.pages[this.state.page].exec();
    }
    return <div>Error, no page found.</div>;
  }

  musicPage() {
    return (<div />);
  }

  togglePageEnabled(pageName, enabled) {
    const [pageIndex] = Object.entries(this.state.pages).find(([pi, p]) => p.name === pageName);
    this.setState({ pages: { [pageIndex]: { enabled } } });
  }

  introPage() {
    return ([
      <div>Which features would you like to enable?</div>,
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 196px)', gridColumnGap: '20px' }}>
        <div className={s.configItem}>
          Music <CheckBox defaultChecked={false} onChange={this.togglePageEnabled.bind(this, 'music')} />
        </div>
        <div className={s.configItem}>
          Warframe <CheckBox defaultChecked={false} onChange={this.togglePageEnabled.bind(this, 'warframe')} />
        </div>
        <div className={s.configItem}>
          Chess <CheckBox defaultChecked={false} onChange={this.togglePageEnabled.bind(this, 'chess')} />
        </div>
        <div className={s.configItem}>
          Moderation log <CheckBox
            defaultChecked={false}
            onChange={this.togglePageEnabled.bind(this, 'moderation log')}
          />
        </div>
      </div>]);
  }

  render() {
    return (<Layout user={this.props.user}>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>{this.props.title}</h1>
          {this.getPage()}
        </div>
      </div>
    </Layout>);
  }
}

Setup.propTypes = {
  user: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  gulid: PropTypes.object.isRequired,
  serverData: PropTypes.object.isRequired,
};

export default withStyles(s)(Setup);
