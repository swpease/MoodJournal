import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import AuthWrapper from '../AuthWrapper/AuthWrapper.js';

const styles = theme => ({
  main: {
    paddingLeft: 16,
    paddingBottom: 16,
    paddingRight: 16,
  },
  title: {
    paddingTop: 10,
  }
});

function HomeView(props) {
  return (
    <AuthWrapper>
      <Typography
        className={props.classes.title}
        variant="display2"
        color="primary"
        align="center"
        gutterBottom
      >
        {'Welcome to Categorical Journal!'}
      </Typography>
      <Typography
        className={props.classes.main}
        variant="body1"
        paragraph
        gutterBottom
      >
        {`Categorical Journal is designed for daily reflection.
          While it is certainly nice to write in a physical journal,
          one of the nice things about keeping a journal in the first
          place is being able to look back on old times and reflect
          on where you've come from, what you've learned, or maybe
          to prevent making the same mistake over again. With
          Categorical Journal, you can put your journal entries
          into any number of customizable categories, and rate the
          entry with a happiness-level indicator ('Excellent', 'Bad',
          etc.), then simply filter your entries history by these factors,
          among others. Sign up to get started!`}
      </Typography>
    </AuthWrapper>
  )
}

export default withStyles(styles)(HomeView);
