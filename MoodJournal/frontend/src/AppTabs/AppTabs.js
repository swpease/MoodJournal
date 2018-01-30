import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';


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
    // const { classes }= this.props;

    return (
      <Paper>
        <Tabs
          value={this.state.value}
          onChange={this.onChange}
          centered
        >
          <Tab label="Categories" />
          <Tab label="Daily" />
          <Tab label="History" />
        </Tabs>
      </Paper>
    )
  }
}

export default AppTabs;
