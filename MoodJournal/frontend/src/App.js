import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';

import CategoryView from './CategoryView/CategoryView.js';
import DailyView from './DailyView/DailyView.js';
import AppTabs from './AppTabs/AppTabs.js';


const STATES  = {
  home: "Home",
  categories: "Categories",
  daily: "Daily",
  history: "History"
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: STATES.home,
    };
    this.handleTabClick = this.handleTabClick.bind(this)
  }

  handleTabClick(state, e) {
    this.setState({
      view: state 
    });
  }

  render() {
    let view = null;
    if (this.state.view === STATES.categories) {
      view = (
        <CategoryView></CategoryView>
      )
    } else if (this.state.view === STATES.daily) {
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
export { STATES as APPSTATES };
