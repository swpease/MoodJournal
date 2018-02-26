import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

class EntryEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialEntry: props.entry,
      entry: props.entry,
      initialRating: props.rating,
      rating: props.rating,
      category: props.category,
      saveBtnDisabled: true,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value
      });
    };
  }

  render() {
    let categoryElement = null;
    if (this.props.category) {
      categoryElement = <Typography variant="headline">{this.props.category}</Typography>
    } else {
      categoryElement = (
        <TextField
          id="select-category"
          select
          label="Category"
          value={this.state.category}
          onChange={this.handleChange("category")}
          SelectProps={{
            native: true,
          }}
          margin="normal"
        >
          {this.props.categories.map(category => (
            <option key={category} value={category}>
              {category}
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
            value={this.state.entry}
            onChange={this.handleChange("entry")}
            margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button onClick={this.props.handleSave}>{"Save"}</Button>
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
  category: PropTypes.string,
  rating: PropTypes.string,
  entry: PropTypes.string,
  // EntryCreator only
  categories: PropTypes.array
}

EntryEditor.defaultProps = {
  category: "",
  rating: "OK",
  entry: ""
}

export default EntryEditor;
