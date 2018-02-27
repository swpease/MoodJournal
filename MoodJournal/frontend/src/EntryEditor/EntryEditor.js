import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

class EntryEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entry: props.entry,
      rating: props.rating,
      category: props.category,
      saveBtnDisabled: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.routeSave = this.routeSave.bind(this);
  }

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

  handleError(error) {
    console.log(error);
  }

  routeSave(e) {
    if (this.props.url) {
      this.props.handleSave(e, this.props.url, this.state.rating, this.state.entry, this.props.handleCancel, this.handleError);
    } else {
      this.props.handleSave(e, this.props.date, this.state.category, this.state.rating, this.state.entry, this.props.handleCancel, this.handleError);
    }
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
          <option key={"123456789012345678901234567890123456789012345678901"} value={""} />
          {this.props.categories.map(category => (
            <option key={category.category} value={category.category}>
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
            value={this.state.entry}
            onChange={this.handleChange("entry")}
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

export default EntryEditor;
