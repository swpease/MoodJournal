import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Reboot from 'material-ui/Reboot';

import 'typeface-roboto';

import CategoryView from './CategoryView/CategoryView.js';
import AppTabs from './AppTabs/AppTabs.js';


class App extends Component {
  constructor(props) {
    super(props);
    // Will have one state per top-level view:
    //     - default    : welcome page
    //     - categories : categories list
    //     - daily      : entries for a given date
    //     - search     : search / filter entries
    this.state = {
      view: 'default',
    };
    this.handleCategoriesTabClick = this.handleCategoriesTabClick.bind(this)
  }

  handleCategoriesTabClick(e) {
    this.setState({
      view: 'categories'
    });
  }

  render() {
    let view = null;
    if (this.state.view === 'categories') {
      view = (
        <CategoryView></CategoryView>
      )
    }

    return (
      <div>
        <Reboot />
        <AppTabs onCategoriesTabClick={this.handleCategoriesTabClick}></AppTabs>
        {view}
      </div>
    );
  }
}

export default App;
