//TODO This component is very similar to CategoryCreator.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { withStyles } from 'material-ui/styles';

import EntryEditor from '../EntryEditor/EntryEditor.js';


const styles = theme => ({
  button: {
    margin: '6px',
  },
});

const STATES = {
  default: "default",
  create: "create"
}

class EntryCreator extends Component {
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
    if (this.state.view === STATES.default) {
      display = (
        <div>
          <Button
            className={this.props.classes.button}
            variant="fab"
            mini
            color="primary"
            aria-label="add"
            onClick={this.toggleState}>
            <AddIcon />
          </Button>
        </div>
      )
    } else if (this.state.view === STATES.create) {
      display = (
        <EntryEditor
          date={this.props.date}
          qualityRatings={this.props.qualityRatings}
          handleSave={this.props.handleSave}
          handleCancel={this.toggleState}
          categories={this.props.categories}
        />
      )
    }
    return display;
  }
}

EntryCreator.propTypes = {
  // All props passed to EntryEditor
  date: PropTypes.string.isRequired,
  qualityRatings: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  // DailyView handleCreate
  handleSave: PropTypes.func.isRequired,
}

export default withStyles(styles)(EntryCreator);
