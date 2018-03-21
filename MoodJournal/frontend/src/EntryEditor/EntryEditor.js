import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


/*
 * EntryEditor is designed for use in EntryCreator (POST) and EntryWidget (PATCH).
 * It has a fixed date based on either the entry being edited (PATCH) or
 * the DatePicker's current date (POST). For POST, the category is required
 * and modifiable. For PATCH, the category is fixed. Rating and Entry are
 * modifiable in both methods.
*/


const styles = theme => ({
  textField: {
    // marginLeft: theme.spacing.unit,
    marginRight: 2 * theme.spacing.unit,
    width: 150,
  },
});


class EntryEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entry: props.entry,
      rating: props.rating,
      category: props.category,
      saveBtnDisabled: true,
      categoryError: false,
      entryError: false,
      categoryHelperText: "",
      entryHelperText: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.routeSave = this.routeSave.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /*
   * Partially applied method.
   * @param field [string]: the state's key to target.
   * @return [func]: the change handler.
  */
  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value
      });
      if (field !== "category") {
        let saveBtnDisabled = e.target.value === this.props[field] ? true : false;
        this.setState({
          saveBtnDisabled: saveBtnDisabled
        });
      }
    };
  }

  /*
   * Used as a callback in the handleSave method.
   * Called in case of 400 response in DailyView.
  */
  handleError(error) {
    let data = error.response.data;
    let categoryErrorMsg = data["category"]
    let entryErrorMsg = data["entry"]
    if (categoryErrorMsg) {
      this.setState({
        categoryError: true,
        categoryHelperText: categoryErrorMsg
      });
    }
    // Not reachable by the average user.
    if (entryErrorMsg) {
      this.setState({
        entryError: true,
        entryHelperText: entryErrorMsg
      });
    }
  }

  // Not sure how else to do this.
  routeSave(e) {
    if (this.props.url) {
      this.props.handleSave(e, this.props.url, this.state.rating, this.state.entry, this.props.handleCancel, this.handleError);
    } else {
      this.props.handleSave(e, this.props.date, this.state.category, this.state.rating, this.state.entry, this.props.handleCancel, this.handleError);
    }
  }

  render() {
    let categoryElement = null;
    // category UI either fixed text (PATCH) or a select widget (POST)
    if (this.props.category) {
      categoryElement = <Typography variant="headline">{this.props.category}</Typography>
    } else {
      categoryElement = (
        <TextField
          id="select-category"
          select
          label="Category"
          className={this.props.classes.textField}
          value={this.state.category}
          onChange={this.handleChange("category")}
          SelectProps={{
            native: true,
          }}
          error={this.state.categoryError}
          helperText={this.state.categoryHelperText}
          margin="normal"
        >
          <option key={"0"} value={""} />
          {this.props.categories.map(category => (
            <option key={category.pk} value={category.pk}>
              {category.category}
            </option>
          ))}
        </TextField>
      )
    }
    return (
      <Card>
        <CardContent>
          <Typography align="right" color="textSecondary">{this.props.date}</Typography>
          {categoryElement}
          <TextField
            id="select-rating"
            select
            label="Rating"
            value={this.state.rating}
            onChange={this.handleChange("rating")}
            SelectProps={{
              native: true,
            }}
            helperText=""
            margin="normal"
          >
            {this.props.qualityRatings.map(rating => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </TextField>
          <TextField
            id="entryField"
            label="Entry"
            multiline
            fullWidth={true}
            inputProps={{
              maxLength: 5000
            }}
            value={this.state.entry}
            onChange={this.handleChange("entry")}
            error={this.state.entryError}
            helperText={this.state.entryHelperText}
            margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button onClick={this.routeSave} disabled={this.state.saveBtnDisabled}>
            {"Save"}
          </Button>
          <Button onClick={this.props.handleCancel}>{"Cancel"}</Button>
        </CardActions>
      </Card>
    )
  }
}

EntryEditor.propTypes = {
  date: PropTypes.string.isRequired,
  qualityRatings: PropTypes.array.isRequired,
  handleSave: PropTypes.func.isRequired,
  // from parent component. Will just toggle the state of said parent.
  handleCancel: PropTypes.func.isRequired,
  // EntryUpdater only
  url: PropTypes.string,
  category: PropTypes.string,
  rating: PropTypes.string,
  entry: PropTypes.string,
  // EntryCreator only
  categories: PropTypes.array
}

EntryEditor.defaultProps = {
  url: "",
  category: "",
  rating: "OK",
  entry: ""
}

export default withStyles(styles)(EntryEditor);
