import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';


class CategoryCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "default"  // Options: "default" and "create".
    };
    this.toggleState = this.toggleState.bind(this);
  }

  toggleState(e) {
    this.setState((prevState) => {
      let nextView = prevState.view === "default" ? "create" : "default";
      return {view: nextView}
    });
  }

  render() {
    let display = null;
    if (this.state.view === "default") {  //TODO enum of states.
      display = (
        <Button fab mini color="primary" aria-label="add" onClick={this.toggleState}>
          <AddIcon />
        </Button>
      )
    }
    return display;
  }
}

CategoryCreator.propTypes = {
  handleCreate: PropTypes.func.isRequired
}

export default CategoryCreator;
