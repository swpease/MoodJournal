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
    this.routeSave = this.routeSave.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value})
  }

  routeSave(e) {
    if (this.props.url) {
      this.props.handleSave(e, this.state.value, this.props.url, this.props.handleClose);
    } else {
      this.props.handleSave(e, this.state.value, this.props.handleClose);
    }
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
          <IconButton aria-label="Save" onClick={this.routeSave}>
            <Save />
          </IconButton>
          <IconButton aria-label="Cancel" onClick={this.props.handleClose}>
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
  // handleClose(e)
  handleClose: PropTypes.func.isRequired,
  // PATCH:  handleSave(e, category, url)
  // CREATE: handleSave(e, category)
  handleSave: PropTypes.func.isRequired
}

CategoryEditor.defaultProps = {
  category: "",
  url: ""
}

export default CategoryEditor;
