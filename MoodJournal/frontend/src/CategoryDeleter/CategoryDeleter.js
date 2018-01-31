import React, { Component } from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import DeleteForever from 'material-ui-icons/DeleteForever';


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


export default CategoryDeleter;
