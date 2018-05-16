import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';

import AuthWrapper from '../AuthWrapper/AuthWrapper.js';
import PasswordChangeView from '../PasswordChangeView/PasswordChangeView.js';
import CategoryView from '../CategoryView/CategoryView.js';

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

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(view) {
    return (e) => {
      this.setState({
        view: view,
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
    let passwordChangeView = (
      <PasswordChangeView />
    )
    let categoriesView = (
      <CategoryView />
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
            <ListItem button divider onClick={this.handleOnClick(VIEWS.categories)}>
              <ListItemText primary="Manage Categories"/>
            </ListItem>
            <ListItem button divider onClick={this.handleOnClick(VIEWS.passwordChange)}>
              <ListItemText primary="Change Password"/>
            </ListItem>
          </List>
        </Drawer>
        {this.state.view === VIEWS.default && defaultView}
        {this.state.view === VIEWS.passwordChange && passwordChangeView}
        {this.state.view === VIEWS.categories && categoriesView}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(AccountView);
