import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

import AuthWrapper from '../AuthWrapper/AuthWrapper.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const styles = theme => ({
  textField: {
    margin: '10px',
    display: 'flex',
  },
});

const LOGIN_URL = '/rest-auth/login/';
const RESET_PW_URL = '/rest-auth/password/reset/';

const VIEWS = {
  default: 'default',
  resend: 'resend',
  resent: 'resent',
}


class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.default,
      username: "",
      password: "",
      email: "",
      generalError: "",
      userError: "",
      showPassword: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.logIn = this.logIn.bind(this);
    this.onError = this.onError.bind(this);
    this.sendPWResetEmail = this.sendPWResetEmail.bind(this);
    this.handleForgotPW = this.handleForgotPW.bind(this);
    this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  handleMouseDownPassword(e) {
    e.preventDefault();
  }

  handleClickShowPassword() {
    this.setState((prevState) => {
      return {showPassword: !prevState.showPassword};
    });
  }

  onError(error) {
    const userErrorMsg = Object.values(error.response.data)[0][0];
    const fieldName = Object.keys(error.response.data)[0];
    const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    const userErrorMsgs = {
      'This field may not be blank.': capitalizedFieldName + ' required.',
      'Must include "username" and "password".': 'Username required.',
      'Unable to log in with provided credentials.': 'Username and / or password are incorrect.',
      "Enter a valid email address.": "Enter a valid email address."
    }
    let userError = userErrorMsgs[userErrorMsg] || 'Unexpected Log In error. Please try again.'
    this.setState({
      userError: userError
    });
  }

  logIn(e) {
    axios.post(LOGIN_URL, {
      username: this.state.username,
      password: this.state.password
    })
      .then(
        (response) => {
          localStorage.setItem('authToken', response.data.token);
          axios.defaults.headers.common['Authorization'] = 'JWT ' + response.data.token;
          this.props.updateAppState();
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            this.onError(error);
          } else {
            this.setState({generalError: error});
          }
        }
      );
  }

  sendPWResetEmail(e) {
    axios.post(RESET_PW_URL, {
      email: this.state.email,
    })
      .then(
        (response) => {
          this.setState({
            view: VIEWS.resent,
          });
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            this.onError(error);
          } else {
            this.setState({generalError: error});
          }
        }
      );
  }

  handleForgotPW(e) {
    this.setState({
      view: VIEWS.resend,
      userError: "",
    });
  }

  render() {
    let generalError = null;
    if (this.state.generalError) {
      generalError = (
        <Typography variant="subheading" color="error">
          {this.state.generalError}
        </Typography>
      )
    }

    let userError = null;
    if (this.state.userError) {
      userError = (
        <Typography variant="subheading" color="error">
          {this.state.userError}
        </Typography>
      )
    }

    let defaultView = (
      <AuthWrapper>
        <Typography variant="title" gutterBottom>
          Log In
        </Typography>
        {generalError}
        {userError}
        <TextField
        id="username"
        label="User Name"
        className={this.props.classes.textField}
        value={this.state.username}
        onChange={this.handleChange('username')}
        margin="normal"
        />
        <FormControl className={this.props.classes.textField}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            onChange={this.handleChange('password')}
            margin="normal"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                >
                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button color="primary" onClick={this.logIn}>
          {"Log In"}
        </Button>
        <Button color="secondary" onClick={this.handleForgotPW}>
          {"Forgot Password"}
        </Button>
      </AuthWrapper>
    )

    let resendView = (
      <AuthWrapper>
        <Typography variant="title" gutterBottom>
          Send Password Reset Email
        </Typography>
        {generalError}
        {userError}
        <TextField
          id="email"
          label="Email"
          className={this.props.classes.textField}
          value={this.state.email}
          onChange={this.handleChange('email')}
          margin="normal"
        />
        <Button color="primary" onClick={this.sendPWResetEmail}>
          {"Send"}
        </Button>
      </AuthWrapper>
    )

    let resentView = (
      <AuthWrapper>
        <Typography variant="title" gutterBottom>
          {"Check your email"}
        </Typography>
      </AuthWrapper>
    )

    return (
      <React.Fragment>
        {this.state.view === VIEWS.default && defaultView}
        {this.state.view === VIEWS.resend && resendView}
        {this.state.view === VIEWS.resent && resentView}
      </React.Fragment>
    );
  }
}

LoginView.propTyes = {
  updateAppState: PropTypes.func.isRequired,
}

export default withStyles(styles)(LoginView);
