import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';

import CategoryView from './CategoryView/CategoryView.js';
import DailyView from './DailyView/DailyView.js';
import AppTabs from './AppTabs/AppTabs.js';
import APPVIEWS from './APPVIEWS.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: APPVIEWS.home,
    };
    this.handleTabClick = this.handleTabClick.bind(this)
  }

  handleTabClick(view, e) {
    this.setState({
      view: view
    });
  }

  render() {
    let view = null;
    if (this.state.view === APPVIEWS.categories) {
      view = (
        <CategoryView></CategoryView>
      )
    } else if (this.state.view === APPVIEWS.daily) {
      view = (
        <DailyView />
      )
    }

    return (
      <div>
        <Reboot />
        <AppTabs handleTabClick={this.handleTabClick}></AppTabs>
        {view}
      </div>
    );
  }
}

export default App;
