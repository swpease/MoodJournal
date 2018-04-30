import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import axios from 'axios';


const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});


class EmailVerification extends Component {
  constructor (props) {
    super(props);
    this.state = {
      verified: false,
      error: "",
    }
  }

  render() {
    let display = "hello world";
    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        {display}
      </MuiThemeProvider>
    );
  }
}

export default EmailVerification;
