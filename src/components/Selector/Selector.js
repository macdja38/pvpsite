import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Selector.css';

class Selector extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    items: PropTypes.array.isRequired,
    callback: PropTypes.func,
  };

  onChange(event) {
    this.setState({ selected: 'changed' });
    event.preventDefault();
  }

  onItemSelect(i) {
    this.toggleVisibility();
    this.props.callback(i);
    this.setState({ label: i.name, itemId: i.id });
  }

  toggleVisibility() {
    this.setState({ visability: !this.state.visability });
  }

  filterFunction(e) {
    const input = e.target.value;
    const filter = input.toUpperCase();
    const a = this.state.items;
    const b = [];
    for (let i = 0; i < a.length; i += 1) {
      if (a[i].name.toUpperCase().indexOf(filter) > -1) {
        b.push(a[i]);
      }
    }
    this.setState({ displayItems: b });
  }

  renderItems(items) {
    let things;
    if (!items) {
      things = [];
    } else {
      things = items;
    }
    return things.map(i =>
      <button
        onClick={() => this.onItemSelect(i)}
        className={s.dropdownElement} key={i.id}
      >
        {i.name}
      </button>);
  }

  render() {
    if (!this.state) {
      this.state = {};
    }
    if (typeof this.state.visability !== 'boolean') {
      this.state.visability = false;
    }
    if (!this.state.items) {
      this.state.items = this.props.items;
      this.state.displayItems = this.props.items;
    }

    if (!this.state.label) {
      this.state.label = this.props.items[0].name;
      this.state.itemId = this.props.items[0].id;
      this.props.callback(this.props.items[0]);
    }

    const renderedItems = this.renderItems(this.state.displayItems);

    return (
      <div className={s.dropdown}>
        <button onClick={(...args) => this.toggleVisibility(...args)} className={s.dropbtn}>{this.state.label}</button>
        <div className={s.dropdownContent} style={this.state.visability ? { display: 'block' } : { display: 'none' }}>
          <input
            className={s.input}
            type="text"
            placeholder="Search..."
            onChange={(...args) => this.filterFunction(...args)}
          />
          <div className={s.dropdownList}>
            {renderedItems}
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(s)(Selector);

/*
<input
        type="text"
        name="prefix"
        className={s.selector}
        defaultValue={prefix}
        onChange={(e) => { this.onChange(e); }}
      />
      */
