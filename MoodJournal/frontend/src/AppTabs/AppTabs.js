import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';


class AppTabs extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onCategoriesTabClick = this.onCategoriesTabClick.bind(this);
  };

  state = {
    value: 0,
  };

  onChange(e, value) {
    this.setState({ value });
  };

  // Tabs hookups.
  onCategoriesTabClick(e) {
    this.props.onCategoriesTabClick(e);
  }

  render() {
    return (
      <Paper>
        <Tabs
          value={this.state.value}
          onChange={this.onChange}
          centered
        >
          <Tab label="Home" />
          <Tab
            label="Categories"
            onClick={this.onCategoriesTabClick}
          />
          <Tab label="Daily" />
          <Tab label="History" />
        </Tabs>
      </Paper>
    )
  }
}

AppTabs.propTypes = {
  onCategoriesTabClick: PropTypes.func.isRequired,
}

export default AppTabs;
