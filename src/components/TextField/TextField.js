import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TextField.css';

class TextField extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    text: PropTypes.string,
    callback: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { text: props.text };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ text: event.target.value });
    this.props.callback(event.target.value);
    event.preventDefault();
  }

  render() {
    return (
      <input className={s.input} value={this.state.text || ''} onChange={this.onChange} />
    );
  }

}

export default withStyles(s)(TextField);
