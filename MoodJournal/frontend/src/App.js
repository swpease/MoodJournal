import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';

import CategoryView from './CategoryView/CategoryView.js';
import AppTabs from './AppTabs/AppTabs.js';


const STATES  = {
  home: "home",
  categories: "categories",
  daily: "daily",
  search: "search"
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: STATES.home,
    };
    this.handleCategoriesTabClick = this.handleCategoriesTabClick.bind(this)
  }

  handleCategoriesTabClick(e) {
    this.setState({
      view: STATES.categories
    });
  }

  render() {
    let view = null;
    if (this.state.view === STATES.categories) {
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
