import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemSecondaryAction } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Cancel from 'material-ui-icons/Cancel';
import Save from 'material-ui-icons/Save';

/*
 * CategoryEditor is designed for use in CategoryCreator and CategoryWidget.
 * It is simply a text editor with a Save and a Discard button.
 * Errors are handled from the server response, and the "too long" restriction
 * on the model field is precluded by a checker within CategoryEditor.
*/
class CategoryEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialValue: props.category,
      value: props.category,
      error: false,
      helperText: "",
      saveBtnDisabled: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.routeSave = this.routeSave.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /*
   * The Text Field is a controlled component.
   * Attempts to save overly long category names are precluded here.
   */
  handleChange(e) {
    let value = e.target.value;
    let saveBtnDisabled = value === this.state.initialValue ? true : false;
    this.setState({
      saveBtnDisabled: saveBtnDisabled
    });

    if (value.length > 50) {
      this.setState({
        error: true,
        helperText: "Max length reached."
      });
    } else {
    this.setState({
      value: value,
      error: false,
      helperText: ""
    })
    }
  }

  /*
   * Callback passed with the data to save in case of an error.
   * Assumes that the error has a response with data (see axios docs).
   */
  handleError(error) {
    let message = Object.values(error.response.data)[0][0];  // e.r.d type: {str: array}
    this.setState({
      error: true,
      helperText: message
    });
  }

  /*
   * Depending on if it's an edit or a create, passes different params,
   * because handleSave is a different function.
   */
  routeSave(e) {
    if (this.props.url) {
      this.props.handleSave(e, this.state.value, this.props.url, this.props.handleClose, this.handleError);
    } else {
      this.props.handleSave(e, this.state.value, this.props.handleClose, this.handleError);
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
          label="Label here"
          helperText={this.state.helperText}
          error={this.state.error}
          margin="normal"
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Save" disabled={this.state.saveBtnDisabled} onClick={this.routeSave}>
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
  // If update.
  category: PropTypes.string,
  // If update.
  url: PropTypes.string,
  // Need b/c not using a label for the text field.
  ariaLabel: PropTypes.string,
  // handleClose(e)
  handleClose: PropTypes.func.isRequired,
  // PATCH:  handleSave(e, category, url, onSuccess, onError)
  // CREATE: handleSave(e, category, onSuccess, onError)
  handleSave: PropTypes.func.isRequired
}

CategoryEditor.defaultProps = {
  category: "",
  url: ""
}

export default CategoryEditor;
