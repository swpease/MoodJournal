import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import axios from 'axios';

import AuthWrapper from '../../AuthWrapper/AuthWrapper.js';

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
const MAIN_SITE_URL = 'http://127.0.0.1:8000/'
const VIEWS = {
  default: 'default',
  submitted: 'submitted',
}

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      token: "",
      new_password1: "",
      new_password2: "",
      new_password1Error: "",
      new_password2Error: "",
      view: VIEWS.default,
    }

    this.confirmNewPassword = this.confirmNewPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getValuesFromUrl = this.getValuesFromUrl.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(error) {  // NB: this does not handle anything besides password value errors.
    this.setState({
      new_password1Error: "",
      new_password2Error: "",
    });
    let data = error.response.data;
    for (const entry of Object.entries(data)) {
      let k, v;
      [k, v] = entry;
      v = v[0];
      const stateField = k + "Error";
      this.setState({[stateField]: v});
    }
  }

  confirmNewPassword(e) {
    let urlData = this.getValuesFromUrl();
    let token = urlData.token;
    let uid = urlData.uid;
    axios.post(CONFIRM_RESET_URL, {
      uid: uid,
      token: token,
      new_password1: this.state.new_password1,
      new_password2: this.state.new_password2,
      view: VIEWS.default
    })
      .then(
        (response) => {
          this.setState({
            view: VIEWS.submitted,
          });
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            this.onError(error);
          } else {
            console.log(error);
          }
        }
      );
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  getValuesFromUrl() {
    let url = window.location.href;
    let wds = url.split("/");
    let token = wds[wds.length - 2];
    let uid = wds[wds.length - 3];
    let data = {
      token: token,
      uid: uid,
    };
    return data
  }

  render() {
    let defaultView = (
      <AuthWrapper>
        <Typography variant="title" gutterBottom>
          {"Create New Password"}
        </Typography>
        <TextField
        id="newpassword1"
        label="New Password"
        className={this.props.classes.textField}
        value={this.state.new_password1}
        error={!!this.state.new_password1Error}
        helperText={this.state.new_password1Error}
        onChange={this.handleChange('new_password1')}
        margin="normal"
        />
        <TextField
        id="newpassword2"
        label="Repeat New Password"
        className={this.props.classes.textField}
        value={this.state.new_password2}
        error={!!this.state.new_password2Error}
        helperText={this.state.new_password2Error}
        onChange={this.handleChange('new_password2')}
        margin="normal"
        />
        <Button color="primary" onClick={this.confirmNewPassword}>
          {"Submit"}
        </Button>
      </AuthWrapper>
    )

    let submittedView = (
      <AuthWrapper>
        <Typography variant="title" gutterBottom>
          {"New Password Created!"}
        </Typography>
        <Button href={MAIN_SITE_URL}>Go To Site</Button>
      </AuthWrapper>
    )

    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        {this.state.view === VIEWS.default && defaultView}
        {this.state.view === VIEWS.submitted && submittedView}
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(PasswordReset);
