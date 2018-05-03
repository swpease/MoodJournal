import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import axios from 'axios';

import AuthWrapper from '../../AuthWrapper/AuthWrapper.js';

import { storageAvailable } from '../../Utils.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

const styles = theme => ({
  textField: {
    margin: '10px',
    display: 'flex',
  },
});

const CONFIRM_RESET_URL = '/rest-auth/password/reset/confirm/'

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      token: "",
      new_password1: "",
      new_password2: "",
    }

    this.confirmNewPassword = this.confirmNewPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if(storageAvailable('localStorage')) {
      let authToken = localStorage.getItem('authToken') || "";
      axios.defaults.headers.common['Authorization'] = 'JWT ' + authToken;
    } else {
      console.log('localStorage not available. Cannot maintain session.') //TODO
    }
  }

  confirmNewPassword(e) {
    return;
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <AuthWrapper>
          <Typography variant="title" gutterBottom>
            {"Create New Password"}
          </Typography>
          <TextField
          id="newpassword1"
          label="New Password"
          className={this.props.classes.textField}
          value={this.state.new_password1}
          onChange={this.handleChange('new_password1')}
          margin="normal"
          />
          <TextField
          id="newpassword2"
          label="Repeat New Password"
          className={this.props.classes.textField}
          value={this.state.new_password2}
          onChange={this.handleChange('new_password2')}
          margin="normal"
          />
          <Button color="primary" onClick={this.confirmNewPassword}>
            {"Submit"}
          </Button>
        </AuthWrapper>
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(PasswordReset);
