import React, {Component} from 'react';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import DeleteForever from 'material-ui-icons/DeleteForever';
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


export default CategoryWidget
