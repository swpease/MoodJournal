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
        </ListItemSecondaryAction>
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete">
            <DeleteForever />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
    // return (
    //   <li>
    //     {this.props.category}
    //     <button type="button" onClick={this.onDeleteBtnClick}>Delete</button>
    //   </li>
    // );
  }
}


export default CategoryWidget
