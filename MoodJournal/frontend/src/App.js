import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import axios from 'axios';

import { storageAvailable } from './Utils.js';

import CategoryView from './CategoryView/CategoryView.js';
import DailyView from './DailyView/DailyView.js';
import HistoryView from './HistoryView/HistoryView.js';
import LoginView from './LoginView/LoginView.js';
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
      loggedIn: false,
      error: "",
    };
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    // TODO: put this in a method and call it whenever view changes.
    if(storageAvailable('localStorage')) {
      let authToken = localStorage.getItem('authToken') || "";
      axios.post('/refresh-token/', {token: authToken})
        .then(
          (response) => {
            axios.defaults.headers.common['Authorization'] = 'JWT ' + response.data.token;
            this.setState({
              loggedIn: true,
            });
          },
          // I suppose I don't really care what happens with the errors here...
          (error) => {
            if (error.response && error.response.status === 400) {
              console.log(error.response.data);
            } else {
              console.log(error);
            }
          }
        );
    } else {
      console.log('localStorage not available. Cannot maintain session.') //TODO
    }
  }

  handleLogOut(e) {
    axios.post('/rest-auth/logout/')
      .then(
        (response) => {
          this.setState({
            loggedIn: false
          });
        },
        (error) => {
          this.setState({
            error: "Error during Log Out: " + error
          });
        }
      )
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
    } else if (this.state.view === APPVIEWS.login) {
      view = (
        <LoginView />
      )
    }

    if (this.state.error) {
      view = this.state.error;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <AppTabs
          handleTabClick={this.handleTabClick}
          loggedIn={this.state.loggedIn}
          handleLogOut={this.handleLogOut}></AppTabs>
        {view}
      </MuiThemeProvider>
    );
  }
}

export default App;
