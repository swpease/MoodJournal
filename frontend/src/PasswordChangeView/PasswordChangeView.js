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

const CHANGE_PW_URL = '/rest-auth/password/change/';

const VIEWS = {
  passwordChange: "passwordChange",
  passwordChangeSuccess: "passwordChangeSuccess",
}

class PasswordChangeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new_password1: "",
      new_password2: "",
      old_password: "",
      new_password1Error: "",
      new_password2Error: "",
      old_passwordError: "",
      view: VIEWS.passwordChange,
    }

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(error) {  // NB: this does not handle anything besides password value errors.
    this.setState({
      old_passwordError: "",
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

  handlePasswordChange(e) {
    axios.post(CHANGE_PW_URL, {
      new_password1: this.state.new_password1,
      new_password2: this.state.new_password2,
      old_password: this.state.old_password
    })
      .then(
        (response) => {
          this.setState({
            view: VIEWS.passwordChangeSuccess,
          });
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            this.onError(error);
          } else if (error.response && error.response.status === 401) {
            this.props.handleBadToken();
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

  render() {
    let passwordChangeView = (
      <AuthWrapper>
        <Typography variant="title" gutterBottom>
          {"Change Password"}
        </Typography>
        <TextField
        id="oldPassword"
        label="Old Password"
        className={this.props.classes.textField}
        value={this.state.old_password}
        error={!!this.state.old_passwordError}
        helperText={this.state.old_passwordError}
        onChange={this.handleChange('old_password')}
        margin="normal"
        />
        <TextField
        id="newPassword1"
        label="New Password"
        className={this.props.classes.textField}
        value={this.state.new_password1}
        error={!!this.state.new_password1Error}
        helperText={this.state.new_password1Error}
        onChange={this.handleChange('new_password1')}
        margin="normal"
        />
        <TextField
        id="newPassword2"
        label="New Password (again)"
        className={this.props.classes.textField}
        value={this.state.new_password2}
        error={!!this.state.new_password2Error}
        helperText={this.state.new_password2Error}
        onChange={this.handleChange('new_password2')}
        margin="normal"
        />
        <Button color="primary" onClick={this.handlePasswordChange}>
          {"Change"}
        </Button>
      </AuthWrapper>
    )

    let passwordChangeSuccessView = (
      <AuthWrapper>
        <Typography variant="title" gutterBottom>
          {"Password Changed!"}
        </Typography>
      </AuthWrapper>
    )

    return (
      <React.Fragment>
        {this.state.view === VIEWS.passwordChange && passwordChangeView}
        {this.state.view === VIEWS.passwordChangeSuccess && passwordChangeSuccessView}
      </React.Fragment>
    )
  }
}

PasswordChangeView.propTypes = {
  handleBadToken: PropTypes.func.isRequired,
}

export default withStyles(styles)(PasswordChangeView);
