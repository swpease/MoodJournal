import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';

import CategoryDeleter from '../CategoryDeleter/CategoryDeleter.js';
import CategoryEditor from '../CategoryEditor/CategoryEditor.js';

/*
 * CategoryWidget has two states: default and edit.
 *   default:  displays the name of a category along with an edit and delete
 *             button. The delete button is a CategoryDeleter instance.
 *             The edit button toggles the state to "edit".
 *   edit:     displays a CategoryEditor widget.
 */


// Prevents categories from overflowing into the buttons and beyond.
const styles = theme => ({
  text: {
    "overflow-wrap": "break-word",
    "max-width": "260px",
  }
})

const STATES = {
  default: "default",
  edit: "edit"
}


class CategoryWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: STATES.default
    };
    this.toggleState = this.toggleState.bind(this);
  }

  toggleState(e) {
    this.setState((prevState) => {
      let nextView = prevState.view === STATES.default ? STATES.edit : STATES.default;
      return {view: nextView}
    });
  }

  render() {
    let display = null;
    if (this.state.view === STATES.default) {
      display = (
      <ListItem divider>
        <ListItemText
          className={this.props.classes.text}
          primary={this.props.category}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Edit" onClick={this.toggleState}>
            <ModeEdit />
          </IconButton>
          <CategoryDeleter
            handleDelete={this.props.handleDelete}
            url={this.props.url}
          ></CategoryDeleter>
        </ListItemSecondaryAction>
      </ListItem>
      )
    } else if (this.state.view === STATES.edit) {
      display = (
        <CategoryEditor
          ariaLabel="Edit category."
          category={this.props.category}
          url={this.props.url}
          handleClose={this.toggleState}
          handleSave={this.props.handleUpdate}
        >
        </CategoryEditor>
      )
    }
    return display;
  }
}

CategoryWidget.propTypes = {
  // Passed to CategoryDeleter and CategoryEditor
  url: PropTypes.string.isRequired,
  // Label
  category: PropTypes.string.isRequired,
  // Passed to CategoryDeleter
  handleDelete: PropTypes.func.isRequired,
  // Passed to CategoryEditor
  handleUpdate: PropTypes.func.isRequired,
  // On the chopping block.
  rank: PropTypes.number
}

export default withStyles(styles)(CategoryWidget);
