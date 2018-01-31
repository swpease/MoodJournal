import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';

import CategoryDeleter from '../CategoryDeleter/CategoryDeleter.js';


class CategoryWidget extends Component {
  render() {
    return (
      <ListItem divider>
        <ListItemText
          primary={this.props.category}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Edit">
            <ModeEdit />
          </IconButton>
          <CategoryDeleter
            handleDelete={this.props.handleDelete}
            url={this.props.url}
          ></CategoryDeleter>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

CategoryWidget.propTypes = {
  url: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  rank: PropTypes.number
}

export default CategoryWidget
