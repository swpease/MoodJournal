import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import axios from 'axios';

import { storageAvailable } from '../../Utils.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

const VERIFY_URL = '/rest-auth/registration/verify-email/'
const RESEND_VERIFY_URL = '/rest-auth/registration/resend-verification-email/'
const MAIN_SITE_URL = 'http://127.0.0.1:8000/'
const VIEWS = {
  unverified: 'unverified',
  verified: 'verified',
  error: 'error',
  resent: 'resent'
}
const ERRORS = {
  keyError: "Your verification key has expired or is faulty. Please request a new one below.",
  permError: "You are not logged in. Please log again.",
}

class EmailVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.unverified,
      errorMsg: "",
    }
    this.verifyEmail = this.verifyEmail.bind(this);
    this.getTokenFromUrl = this.getTokenFromUrl.bind(this);
    this.onError = this.onError.bind(this);
    this.resendVerify = this.resendVerify.bind(this);
  }

  componentDidMount() {
    if(storageAvailable('localStorage')) {
      let authToken = localStorage.getItem('authToken') || "";
      axios.defaults.headers.common['Authorization'] = 'JWT ' + authToken;
    } else {
      console.log('localStorage not available. Cannot maintain session.') //TODO
    }
  }

  onError(error) {
    if (error.response.status == 404) {  // https://github.com/pennersr/django-allauth/blob/master/allauth/account/models.py from_key method: it doesn't discriminate bad or expired keys
      this.setState({
        view: VIEWS.error,
        errorMsg: ERRORS.keyError
      });
    } else if (error.response.status == 401 ){
      this.setState({
        view: VIEWS.error,
        errorMsg: ERRORS.permError
      })
    }
  }

  resendVerify() {
    axios.get(RESEND_VERIFY_URL)
      .then(
        (response) => {
          this.setState({
            view: VIEWS.resent,
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

  verifyEmail() {
    let token = this.getTokenFromUrl();
    axios.post(VERIFY_URL, {
      key: token,
    })
      .then(
        (response) => {
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
          <a href={MAIN_SITE_URL}>Click here</a>
          to continue to the site.
      </Typography>
    )
    let error = (
      <React.Fragment>
        <Typography
          variant="headline"
          gutterBottom>
            {this.state.errorMsg}
        </Typography>
        {this.state.errorMsg === ERRORS.keyError &&
          <Button color="primary" onClick={this.resendVerify}>
            Resend
          </Button>
        }
        {this.state.errorMsg === ERRORS.permError &&
          <Typography
            variant="body2"
            gutterBottom>
              Return to <a href={MAIN_SITE_URL}>main site</a> to log back in.
          </Typography>
        }
      </React.Fragment>
    )
    let resent = (
      <Typography
        variant="headline"
        gutterBottom>
        Confirmation email resent. Check your email.
      </Typography>
    )
    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        {this.state.view === VIEWS.unverified && unverified}
        {this.state.view === VIEWS.verified && verified}
        {this.state.view === VIEWS.error && error}
        {this.state.view === VIEWS.resent && resent}
      </MuiThemeProvider>
    );
  }
}

export default EmailVerification;
