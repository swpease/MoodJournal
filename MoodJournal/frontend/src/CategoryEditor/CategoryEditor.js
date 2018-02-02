import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Cancel from 'material-ui-icons/Cancel';
import Save from 'material-ui-icons/Save';


class CategoryEditor extends Component {
  render() {
    return (
      <ListItem divider>
        <ListItemSecondaryAction>
          <IconButton aria-label="Save">
            <Save />
          </IconButton>
          <IconButton aria-label="Cancel">
            <Cancel />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

CategoryEditor.propTypes = {
  category: PropTypes.string,
  url: PropTypes.string,
  // saveHandler: PropTypes.func.isRequired
}

CategoryEditor.defaultProps = {
  category: "",
  url: ""
}

export default CategoryEditor;
