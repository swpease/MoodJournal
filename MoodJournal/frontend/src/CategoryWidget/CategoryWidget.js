import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';

import CategoryDeleter from '../CategoryDeleter/CategoryDeleter.js';
import CategoryEditor from '../CategoryEditor/CategoryEditor.js';


// Prevents categories from overflowing into the buttons and beyond.
const styles = theme => ({
  text: {
    "overflow-wrap": "break-word",
    "max-width": "260px",
  }
})


class CategoryWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "default"  // Options: "default" and "edit".
    };
    this.toggleState = this.toggleState.bind(this);
  }

  toggleState(e) {
    this.setState((prevState) => {
      let nextView = prevState.view === "default" ? "edit" : "default";
      return {view: nextView}
    });
  }

  render() {
    let display = null;
    if (this.state.view === "default") {  //TODO enum of states.
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
    } else if (this.state.view === "edit") {
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
  url: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  rank: PropTypes.number
}

export default withStyles(styles)(CategoryWidget);
