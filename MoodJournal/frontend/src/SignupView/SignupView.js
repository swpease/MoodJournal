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

const SIGNUP_URL = '/rest-auth/registration/';

class SignupView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password1: "",
      password2: "",
      email: "",
      generalError: "",
      userError: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.register = this.register.bind(this);
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
    console.log(error);
  }

  register(e) {
    let data = {
      username: this.state.username,
      password1: this.state.password1,
      password2: this.state.password2,
    }
    if (this.state.email) {
      data.email = this.state.email;
    }

    axios.post(SIGNUP_URL, data)
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            console.log(error.response);
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
      console.log(generalError);
      // generalError = (
      //   <Typography variant="subheading" color="error">
      //     {this.state.generalError}
      //   </Typography>
      // )
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
          Register
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
        id="password1"
        label="Password"
        className={this.props.classes.textField}
        value={this.state.password1}
        onChange={this.handleChange('password1')}
        margin="normal"
        />
        <TextField
        id="password2"
        label="Password (again)"
        className={this.props.classes.textField}
        value={this.state.password2}
        onChange={this.handleChange('password2')}
        margin="normal"
        />
        <TextField
        id="Email"
        label="Email (optional)"
        className={this.props.classes.textField}
        value={this.state.email}
        onChange={this.handleChange('email')}
        margin="normal"
        />
        <Button color="primary" onClick={this.register}>
          {"Register"}
        </Button>
      </AuthWrapper>
    );
  }

}

SignupView.propTypes = {
  updateAppState: PropTypes.func.isRequired,
}


export default withStyles(styles)(SignupView);
