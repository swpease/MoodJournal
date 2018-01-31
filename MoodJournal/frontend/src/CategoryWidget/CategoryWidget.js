import React, {Component} from 'react';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import DeleteForever from 'material-ui-icons/DeleteForever';
import ModeEdit from 'material-ui-icons/ModeEdit';

class CategoryWidget extends Component {
  constructor(props) {
    super(props);
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
  }

  onDeleteBtnClick(e) {
    this.props.onDeleteBtnClick(this.props.url);
  }

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
          <IconButton aria-label="Delete" onClick={this.onDeleteBtnClick}>
            <DeleteForever />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}


export default CategoryWidget
