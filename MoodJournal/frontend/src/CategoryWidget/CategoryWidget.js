import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';

import CategoryDeleter from '../CategoryDeleter/CategoryDeleter.js';
import CategoryEditor from '../CategoryEditor/CategoryEditor.js';


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
          handleCancel={this.toggleState}
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
  rank: PropTypes.number
}

export default CategoryWidget
