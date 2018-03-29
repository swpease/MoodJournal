import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import CategoryView from './CategoryView/CategoryView.js';
import DailyView from './DailyView/DailyView.js';
import HistoryView from './HistoryView/HistoryView.js';
import AppTabs from './AppTabs/AppTabs.js';
import APPVIEWS from './APPVIEWS.js';


const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});


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
        <CategoryView />
      )
    } else if (this.state.view === APPVIEWS.daily) {
      view = (
        <DailyView />
      )
    } else if (this.state.view === APPVIEWS.history) {
      view = (
        <HistoryView />
      )
    }

    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <AppTabs handleTabClick={this.handleTabClick}></AppTabs>
        {view}
      </MuiThemeProvider>
    );
  }
}

export default App;
