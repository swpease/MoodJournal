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

class EmailVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      error: "",
    }
    this.verifyEmail = this.verifyEmail.bind(this);
    this.getTokenFromUrl = this.getTokenFromUrl.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(error) {
    console.log(error);
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
            verified: true,
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
    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        {unverified}
      </MuiThemeProvider>
    );
  }
}

export default EmailVerification;
