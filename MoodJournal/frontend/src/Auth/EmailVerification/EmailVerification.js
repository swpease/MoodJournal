import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import axios from 'axios';


const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});


class EmailVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      error: "",
    }
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
