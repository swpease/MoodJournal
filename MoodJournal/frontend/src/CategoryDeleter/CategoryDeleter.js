import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import DeleteForever from 'material-ui-icons/DeleteForever';

/*
 * CategoryDeleter renders a span containing a button to delete forever
 * an item, as well as an "are you sure" dialog. Upon confirmation, it
 * calls the delete handler callback prop with the target's url.
 */
class CategoryDeleter extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleClickOpen(e) {
    this.setState({open: true});
  }

  handleClose(e) {
    this.setState({open: false});
  }

  // Just exists to pass an arg to the callback fn.
  handleConfirm(e) {
    this.props.handleDelete(this.props.url);
  }

  render() {
    return (
      <span>
        <IconButton aria-label="Delete" onClick={this.handleClickOpen}>
          <DeleteForever />
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Delete this category?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Deleting this category will also delete any journal entries
              listed under this category.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    )
  }
}

CategoryDeleter.propTypes = {
  // URL of the target to delete. To pass to handleDelete.
  url: PropTypes.string.isRequired,
  // handleDelete(url) should delete the resource at URL url.
  handleDelete: PropTypes.func.isRequired,
  // In case you want to display the text representation
  // of what the user is deleting.
  target: PropTypes.string
}

export default CategoryDeleter;
