import React from 'react';
import { withStyles } from 'material-ui/styles';
import Card from 'material-ui/Card';


const styles = theme => ({
  root: {
    margin: '25px auto 50px',
    width: '100%',
    maxWidth: 720,
    backgroundColor: theme.palette.background.paper,
  },
});

function AuthWrapper(props) {
  return (
    <div className={props.classes.root}>
      <Card>
        {props.children}
      </Card>
    </div>
  )
}

export default withStyles(styles)(AuthWrapper);
