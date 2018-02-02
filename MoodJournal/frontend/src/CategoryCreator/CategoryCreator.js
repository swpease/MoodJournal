import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

import CategoryEditor from '../CategoryEditor/CategoryEditor.js';


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
    } else if (this.state.view === "create") {
      display = (
        <CategoryEditor
          handleCancel={this.toggleState}
          ariaLabel="Create a new category."
        >
        </CategoryEditor>
      )
    }
    return display;
  }
}

CategoryCreator.propTypes = {
  handleCreate: PropTypes.func.isRequired
}

export default CategoryCreator;
