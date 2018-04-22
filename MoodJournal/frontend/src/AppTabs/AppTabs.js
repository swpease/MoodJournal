import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';

import APPVIEWS from '../APPVIEWS.js';

class AppTabs extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  };

  state = {
    value: 0,
  };

  onChange(e, value) {
    this.setState({ value });
  };

  render() {
    return (
      <Paper>
        <Tabs
          value={this.state.value}
          onChange={this.onChange}
          centered
        >
          <Tab
            label={APPVIEWS.home}
            onClick={(e) => {this.props.handleTabClick(APPVIEWS.home, e)}}
          />
          {this.props.loggedIn &&
          <React.Fragment>
            <Tab
              label={APPVIEWS.categories}
              onClick={(e) => {this.props.handleTabClick(APPVIEWS.categories, e)}}
            />
            <Tab
              label={APPVIEWS.daily}
              onClick={(e) => {this.props.handleTabClick(APPVIEWS.daily, e)}}
            />
            <Tab
              label={APPVIEWS.history}
              onClick={(e) => {this.props.handleTabClick(APPVIEWS.history, e)}}
            />
          </React.Fragment>
          }
          {!this.props.loggedIn &&
          <Tab
            label={APPVIEWS.login}
            onClick={(e) => {this.props.handleTabClick(APPVIEWS.login, e)}}
          />
          }
        </Tabs>
      </Paper>
    )
  }
}

AppTabs.propTypes = {
  handleTabClick: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
}

export default AppTabs;
