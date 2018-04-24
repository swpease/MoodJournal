import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

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


class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      generalError: "",
      userError: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.logIn = this.logIn.bind(this);
    this.onError = this.onError.bind(this);
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  onError(error) {
    const userErrorMsg = Object.values(error.response.data)[0][0];
    const userErrorMsgs = {
      'This field may not be blank.': 'Password required.',
      'Must include "username" and "password".': 'Username required.',
      'Unable to log in with provided credentials.': 'Username and / or password are incorrect.'
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

    return (
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
        <TextField
        id="password"
        label="Password"
        className={this.props.classes.textField}
        value={this.state.password}
        onChange={this.handleChange('password')}
        margin="normal"
        />
        <Button color="primary" onClick={this.logIn}>
          {"Log In"}
        </Button>
      </AuthWrapper>
    );
  }
}

LoginView.propTyes = {
  updateAppState: PropTypes.func.isRequired,
}

export default withStyles(styles)(LoginView);
