import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';

import AuthWrapper from '../AuthWrapper/AuthWrapper.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const styles = theme => ({
  drawerPaper: {
    width: 240,
  },
  toolbar: theme.mixins.toolbar,
});

const VIEWS = {
  default: 'default',
  passwordChange: 'passwordChange',
  categories: 'categories',
  resendConfirmation: 'resendConfirmation'
}

class AccountView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.default,
    }
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  render() {
    let defaultView = (
      <AuthWrapper>
        <Typography gutterBottom>
          {`
            You can manage your account with the buttons to the left.
          `}
        </Typography>
      </AuthWrapper>
    )
    return (
      <React.Fragment>
        <Drawer
          variant='permanent'
          classes={{
            paper: this.props.classes.drawerPaper,
          }}
        >
          <div className={this.props.classes.toolbar} />
          <List>
            <ListItem button divider>
              <ListItemText primary="Manage Categories"/>
            </ListItem>
            <ListItem button divider>
              <ListItemText primary="Change Password"/>
            </ListItem>
            <ListItem button divider>
              <ListItemText primary="Resend Confirmation Email"/>
            </ListItem>
          </List>
        </Drawer>
        {this.state.view === VIEWS.default && defaultView}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(AccountView);
