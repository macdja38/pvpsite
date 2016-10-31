import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Selector.css';

class Selector extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    items: PropTypes.array.isRequired,
  };

  onChange(event, serverId) {
    this.setState({ selected: 'changed' });
    event.preventDefault();
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

  myFunction() {
    this.setState({ visability: !this.state.visability });
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
        onClick={() => { this.setState({ label: i.name, itemId: i.id }); this.myFunction(); }}
        className={s.dropdownElement} key={i.id}>{i.name}
      </button>);
  }

  render() {
    const { items, serverId } = this.props; // eslint-disable-line no-use-before-define

    console.log(items);

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
      this.state.label = 'All';
      this.state.itemId = '*';
    }

    const renderedItems = this.renderItems(this.state.displayItems);

    return (
      <div className={s.dropdown}>
        <button onClick={(...args) => this.myFunction(...args)} className={s.dropbtn}>{this.state.label}</button>
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
