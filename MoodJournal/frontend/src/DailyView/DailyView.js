import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';
import moment from 'moment';
import { DatePicker } from 'material-ui-pickers';

import CustomProgress from '../CustomProgress/CustomProgress.js';
import EntryWidget from '../EntryWidget/EntryWidget.js';
import EntryCreator from '../EntryCreator/EntryCreator.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


/*
 * 1. Displays the EntryInstances for a given day.
 * 2. Provides an EntryInstance creation widget.
 * Layout:
 *  - DatePicker
 *  - EntryInstances list of Cards
 *  - EntryCreator
*/


const styles = theme => ({
  root: {
    margin: '25px auto 0px',
    width: '100%',
    maxWidth: 720,
    backgroundColor: theme.palette.background.paper,
  },
  datePicker: {
    margin: '10px',
  },
});


class DailyView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      categories: [],
      qualityRatings: [],
      entries: [],
      selectedDate: moment()
    };
    this.getCategoryName = this.getCategoryName.bind(this);
    this.getUnusedCategories = this.getUnusedCategories.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    // Defaults to populating with entries for the current day.
    let baseUrl = '/api/entries/';
    let queryString = '?date=' + moment().format('YYYY-MM-DD');
    let fullUrl = baseUrl + queryString;

    axios.get(fullUrl)
      .then(
        (response) => {
          this.setState({
            entries: response.data
          });
          return axios.get('/api/categories/')
        }
      )
      .then(
        (response) => {
          this.setState({
            categories: response.data
          });
          return axios.get('/api/quality-ratings/')
        }
      )
      .then(
        (response) => {
          this.setState({
            isLoaded: true, // Need for the widgets.
            qualityRatings: response.data
          });
        }
      )
      .catch(
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  handleDelete(url) {
    axios.delete(url)
      .then(
        (response) => {
          this.setState((prevState) => {
            return {entries: prevState.entries.filter(datum => datum.url !==  url)}
          });
        },
        (error) => {
          this.setState({
            error
          });
        }
      );
  }

  handleCreate(e, date, categoryId, rating, entry, onSuccess, onError) {
    axios.post('/api/entries/', {
      date: date,
      category: categoryId,
      quality_rating: rating,
      entry: entry
    }).then(
      (response) => {
        onSuccess();
        this.setState((prevState) => {
          return {entries: prevState.entries.concat([response.data])};
        });
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          onError(error);
        } else {
          this.setState({error});
        }
      }
    );
  }

  handleUpdate(e, url, rating, entry, onSuccess, onError) {
    axios.patch(url, {
      quality_rating: rating,
      entry: entry
    }).then(
      (response) => {
        onSuccess();
        this.setState((prevState) => {
          let oldData = prevState.entries
          let replaceIndex = oldData.findIndex(item => item.url === response.data.url);
          let newData = oldData.splice(replaceIndex, 1, response.data);
          return newData;
        })
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          onError(error);
        } else {
          this.setState({error});
        }
      }
    );
  }

  /*
   * Updates the state's entries array to contain only those entries for
   * the selected date.
  */
  handleDateChange(date) {
    this.setState({
      selectedDate: date
    });
    let baseUrl = '/api/entries/';
    let queryString = '?date=' + date.format('YYYY-MM-DD');
    let fullUrl = baseUrl + queryString;

    axios.get(fullUrl)
      .then(
        (response) => {
          this.setState({
            entries: response.data
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  /*
   * Populates the categories options widget in EntryCreator with only
   * unused categories, providing frontend enforcement of unique-for-date.
  */
  getUnusedCategories() {
    let usedCategories = this.state.entries.map(entry => entry.category);
    let unusedCategories = this.state.categories.filter(category => !(usedCategories.includes(category.pk)));
    return unusedCategories;
  }

  /*
   * For EntryWidget. We don't update category in PATCH, so we just need the
   * name, not the pk.
  */
  getCategoryName(pk) {
    let categoryObject = this.state.categories.find(category => category.pk === pk);
    return categoryObject.category
  }

  render() {
    const { error, isLoaded, entries, qualityRatings } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div>
          <CustomProgress />
        </div>
      );
    } else {
      let entryWidgets = entries.map(datum =>
        <EntryWidget
          key={datum.url}
          url={datum.url}
          date={datum.date}
          category={this.getCategoryName(datum.category)}
          rating={datum.quality_rating}
          entry={datum.entry}
          qualityRatings={qualityRatings}
          handleDelete={this.handleDelete}
          handleSave={this.handleUpdate}
        />
      );
      return (
        <div className={this.props.classes.root}>
          <DatePicker
            className={this.props.classes.datePicker}
            value={this.state.selectedDate}
            onChange={this.handleDateChange}
            disableFuture={true}
            keyboard
            label="Choose a date"
          />
          {entryWidgets}
          <EntryCreator
            date={this.state.selectedDate.format('YYYY-MM-DD')}
            qualityRatings={this.state.qualityRatings}
            handleSave={this.handleCreate}
            categories={this.getUnusedCategories()}
          />
        </div>
      )
    }
  }
}

export default withStyles(styles)(DailyView);
