import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemSecondaryAction } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Cancel from 'material-ui-icons/Cancel';
import Save from 'material-ui-icons/Save';


class CategoryEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.category
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value})
  }

  render() {
    const inputProps = {
      "aria-label": this.props.ariaLabel
    }
    return (
      <ListItem divider>
        <TextField
          id="categoryeditor"
          inputProps={inputProps}
          value={this.state.value}
          onChange={this.handleChange}
          autoFocus
          margin="normal"
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Save">
            <Save />
          </IconButton>
          <IconButton aria-label="Cancel" onClick={this.props.handleCancel}>
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
  ariaLabel: PropTypes.string,
  // handleCancel(e)
  handleCancel: PropTypes.func.isRequired
  // saveHandler(e, category, url)
  // saveHandler: PropTypes.func.isRequired
}

CategoryEditor.defaultProps = {
  category: "",
  url: ""
}

export default CategoryEditor;
