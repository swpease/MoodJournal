import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';

import { APPSTATES } from '../App.js';

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
            label={APPSTATES.home}
            onClick={(e) => {this.props.handleTabClick(APPSTATES.home, e)}}
          />
          <Tab
            label={APPSTATES.categories}
            onClick={(e) => {this.props.handleTabClick(APPSTATES.categories, e)}}
          />
          <Tab
            label={APPSTATES.daily}
            onClick={(e) => {this.props.handleTabClick(APPSTATES.daily, e)}}
          />
          <Tab
            label={APPSTATES.history}
            onClick={(e) => {this.props.handleTabClick(APPSTATES.history, e)}}
          />
        </Tabs>
      </Paper>
    )
  }
}

AppTabs.propTypes = {
  handleTabClick: PropTypes.func.isRequired,
}

export default AppTabs;
