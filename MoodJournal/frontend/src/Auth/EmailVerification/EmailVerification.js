import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import axios from 'axios';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

const VERIFY_URL = '/rest-auth/registration/verify-email/'
const VIEWS = {
  unverified: 'unverified',
  verified: 'verified',
  error: 'error'
}

class EmailVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.unverified,
      error: 'Your verification key has expired or is faulty. Please request a new one below.',
    }
    this.verifyEmail = this.verifyEmail.bind(this);
    this.getTokenFromUrl = this.getTokenFromUrl.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(error) {
    if (error.response.status == 404) {  // https://github.com/pennersr/django-allauth/blob/master/allauth/account/models.py from_key method: it doesn't discriminate bad or expired keys
      this.setState({
        view: VIEWS.error,
      });
    } else {
      console.log(error);
    }
  }

  verifyEmail() {
    let token = this.getTokenFromUrl();
    axios.post(VERIFY_URL, {
      key: token,
    })
      .then(
        (response) => {
          console.log(response);
          this.setState({
            view: VIEWS.verified,
          });
        },
        (error) => {
          if (error.response) {
            this.onError(error);
          } else {
            console.log(error);
          }
        }
      );
  }

  getTokenFromUrl() {
    let url = window.location.href;
    let wds = url.split("/");
    let token = wds[wds.length - 2];
    return token;
  }

  render() {
    let unverified = (
      <React.Fragment>
        <Typography
          variant="headline"
          gutterBottom>
          Thanks for signing up! Click below to verify your email.
        </Typography>
        <Button color="primary" onClick={this.verifyEmail}>
          Verify
        </Button>
      </React.Fragment>
    )
    let verified = (
      <Typography
        variant="headline"
        gutterBottom>
          Email verified!
          <a href="http://127.0.0.1:8000/">Click here</a>
          to continue to the site.
      </Typography>
    )
    let error = (
      <Typography
        variant="headline"
        gutterBottom>
          {this.state.error}
      </Typography>
    )
    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        {this.state.view === VIEWS.unverified && unverified}
        {this.state.view === VIEWS.verified && verified}
        {this.state.view === VIEWS.error && error}
      </MuiThemeProvider>
    );
  }
}

export default EmailVerification;
