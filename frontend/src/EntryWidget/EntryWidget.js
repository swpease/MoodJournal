import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import EntryEditor from '../EntryEditor/EntryEditor.js';
/*
 * EntryWidget has two states: default and edit.
 * default:
 *  displays a card containing the EntryInstance (backend) data:
 *    date, entry, rating, category
 * edit:
 *  displays a card as in default, but with an editable entry and editable
 *  rating widget. Element is an EntryEditor.
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
    const { date, category, rating, entry, url, handleDelete, handleSave, qualityRatings } = this.props;
    let display = null;
    if (this.state.view === STATES.default) {
      display = (
        <Card>
          <CardContent>
            <Typography align="right" color="textSecondary">{date}</Typography>
            <Typography variant="headline">{category}</Typography>
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
        <EntryEditor
          url={url}
          date={date}
          category={category}
          handleSave={handleSave}
          handleCancel={this.toggleState}
          qualityRatings={qualityRatings}
          rating={rating}
          entry={entry}
        />
      )
    }
    return display;
  }
}

EntryWidget.propTypes = {
  date: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  entry: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  // For PATCHing
  url: PropTypes.string.isRequired,
  // DailyView's PATCH handler:
  handleSave: PropTypes.func.isRequired,
  qualityRatings: PropTypes.array.isRequired
}

export default EntryWidget;
