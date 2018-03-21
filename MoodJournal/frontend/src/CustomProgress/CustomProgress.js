import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import { CircularProgress } from 'material-ui/Progress';

/*
 * These styles basically just give the CircularProgress a top margin and
 * center it in its containing div.
 */
const styles = theme => ({
  root: {
    display: 'flex',
  },
  progress: {
    margin: '25px auto 0px',
  },
});

function CustomProgress(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress}/>
    </div>
  )
}

CustomProgress.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CustomProgress);
