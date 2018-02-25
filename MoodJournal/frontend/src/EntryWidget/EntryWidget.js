import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
/*
 * EntryWidget has two states: default and edit.
 *
*/

const STATES = {
  default: "default",
  edit: "edit"
}

class EntryWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: STATES.default
    };
    this.toggleState = this.toggleState.bind(this);
  }

  toggleState(e) {
    this.setState((prevState) => {
      let nextView = prevState.view === STATES.default ? STATES.edit : STATES.default;
      return {view: nextView}
    });
  }

  render() {
    // pass other to EU
    const { date, categoryName, rating, entry, url, handleDelete, classes, ...other } = this.props;
    let display = null;
    if (this.state.view === STATES.default) {
      display = (
        <Card>
          <CardContent>
            <Typography align="right" color="textSecondary">{date}</Typography>
            <Typography variant="headline">{categoryName}</Typography>
            <Typography variant="subheading" color="textSecondary" gutterBottom>{rating}</Typography>
            <Typography component="p">{entry}</Typography>
          </CardContent>
          <CardActions>
            <Button onClick={this.toggleState}>Edit</Button>
            <Button onClick={(e) => handleDelete(url, e)}>Delete</Button>
          </CardActions>
        </Card>
      )
    } else if (this.state.view === STATES.edit) {
      display = (
        <Button onClick={this.toggleState}>Revert</Button>
      )
    }
    return display;
  }
}

EntryWidget.propTypes = {
  date: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  categoryName: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  entry: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  // For PATCHing
  url: PropTypes.string.isRequired,
  // DailyView's PATCH handler:
  handleSave: PropTypes.func.isRequired,
  // For PATCHing
  qualityRatings: PropTypes.array.isRequired
  // classes is provided by withStyles
}

export default EntryWidget;
