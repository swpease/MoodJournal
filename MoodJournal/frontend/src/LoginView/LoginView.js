import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';
import TextField from 'material-ui/TextField';

import AuthWrapper from '../AuthWrapper/AuthWrapper.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const styles = theme => ({
  textField: {
    margin: '10px',
    display: 'flex',
  },
});


class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
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
      <AuthWrapper>
        <TextField
        id="username"
        label="User Name"
        className={this.classes.textField}
        value={this.state.username}
        onChange={this.handleChange('username')}
        margin="normal"
        />
        <TextField
        id="password"
        label="Password"
        className={this.classes.textField}
        value={this.state.username}
        onChange={this.handleChange('password')}
        margin="normal"
        />
      </AuthWrapper>
    );
  }
}

export default withStyles(styles)(LoginView);
