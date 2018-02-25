import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

import CategoryEditor from '../CategoryEditor/CategoryEditor.js';


/*
 * CategoryCreator has two states: default and create.
 *   default: Displays an "add" fab.
 *   create:  Displays a CategoryEditor widget in place of the fab.
 */

const STATES = {
  default: "default",
  create: "create"
}


class CategoryCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: STATES.default
    };
    this.toggleState = this.toggleState.bind(this);
  }

  toggleState(e) {
    this.setState((prevState) => {
      let nextView = prevState.view === STATES.default ? STATES.create : STATES.default;
      return {view: nextView}
    });
  }

  render() {
    let display = null;
    if (this.state.view === STATES.default) {  //TODO enum of states.
      display = (
        <Button variant="fab" mini color="primary" aria-label="add" onClick={this.toggleState}>
          <AddIcon />
        </Button>
      )
    } else if (this.state.view === STATES.create) {
      display = (
        <CategoryEditor
          handleClose={this.toggleState}
          handleSave={this.props.handleCreate}
          ariaLabel="Create a new category."
        />
      )
    }
    return display;
  }
}

CategoryCreator.propTypes = {
  // Passed through to CategoryEditor
  handleCreate: PropTypes.func.isRequired
}

export default CategoryCreator;
