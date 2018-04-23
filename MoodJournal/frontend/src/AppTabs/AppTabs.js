import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';

import APPVIEWS from '../APPVIEWS.js';

class AppTabs extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = {
      value: APPVIEWS.home,
    };
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  // TODO: remove?
  onChange(e, value) {
    if (value === APPVIEWS.logout) {
      value = APPVIEWS.home;
    }
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
            value={APPVIEWS.home}
          />
          {this.props.loggedIn &&
            <Tab
              label={APPVIEWS.categories}
              onClick={(e) => {this.props.handleTabClick(APPVIEWS.categories, e)}}
              value={APPVIEWS.categories}
            />
          }
          {this.props.loggedIn &&
            <Tab
              label={APPVIEWS.daily}
              onClick={(e) => {this.props.handleTabClick(APPVIEWS.daily, e)}}
              value={APPVIEWS.daily}
            />
          }
          {this.props.loggedIn &&
            <Tab
              label={APPVIEWS.history}
              onClick={(e) => {this.props.handleTabClick(APPVIEWS.history, e)}}
              value={APPVIEWS.history}
            />
          }
          {this.props.loggedIn &&
            <Tab
              label={APPVIEWS.logout}
              onClick={this.props.handleLogOut}
              value={APPVIEWS.logout}
            />
          }
          {!this.props.loggedIn &&
          <Tab
            label={APPVIEWS.login}
            onClick={(e) => {this.props.handleTabClick(APPVIEWS.login, e)}}
            value={APPVIEWS.login}
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
  handleLogOut: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default AppTabs;
