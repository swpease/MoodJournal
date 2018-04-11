import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';
import moment from 'moment';
import { DatePicker } from 'material-ui-pickers';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import InfiniteScroll from 'react-infinite-scroller';

import CustomProgress from '../CustomProgress/CustomProgress.js';
import EntryWidget from '../EntryWidget/EntryWidget.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const styles = theme => ({
  root: {
    margin: '25px auto 50px',
    width: '100%',
    maxWidth: 720,
    backgroundColor: theme.palette.background.paper,
  },
  drawerPaper: {
    width: 240,
  },
  datePicker: {
    margin: '10px',
  },
  textField: {
    margin: '10px',
    display: 'flex',
  },
});


class HistoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      categories: [],
      qualityRatings: [],
      entries: [],
      moreEntriesUrl: null,
      entriesCount: null,
      queryParams: {
        date_start: moment(),
        date_end: moment(),
        category: "",
        quality_rating: "",
        entry: "",
      },
    };
    this.getCategoryName = this.getCategoryName.bind(this);
    this.loadMoreEntries = this.loadMoreEntries.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
  }

  componentDidMount() {
    axios.get('/api/entries/')
      .then(
        (response) => {
          let oldestEntry = response.data.results[0];
          let qPs = {...this.state.queryParams};
          qPs.date_start = moment(oldestEntry.date);
          this.setState({
            entries: response.data.results,
            moreEntriesUrl: response.data.next,
            entriesCount: response.data.count,
            queryParams: qPs
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

  //TODO deal with filters.
  loadMoreEntries() {
    axios.get(this.state.moreEntriesUrl)
      .then(
        (response) => {
          this.setState((prevState) => {
            return {
              entries: prevState.entries.concat(response.data.results),
              moreEntriesUrl: response.data.next,
            };
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  /*
   * For EntryWidget. We don't update category in PATCH, so we just need the
   * name, not the pk.
  */
  getCategoryName(pk) {
    let categoryObject = this.state.categories.find(category => category.pk === pk);
    return categoryObject.category
  }

/*
 * For axios calls when filtering.
*/
  composeQueryString() {
    let queryParams = this.state.queryParams;
    let base = '/api/entries/';
    let queryString = '?';
    for (let k in queryParams) {
      queryString += k + "=" + queryParams[k] + "&";
    }
    queryString = queryString.slice(0, -1);
    let url = base + queryString;
    return url;
  }

/*
 *  Partially applied method for controlled component updating.
 */
  handleQueryChange(field) {
    return (e) => {
      let qPs = {...this.state.queryParams};
      qPs[field] = e.target ? e.target.value : e; // if its just e, it's a date.
      this.setState({
        queryParams: qPs
      });
      //TODO axios call.
    }
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
        <React.Fragment>
          <Drawer
            variant='permanent'
            classes={{
              paper: this.props.classes.drawerPaper,
            }}
          >
            {'Hello'}
            <DatePicker
              className={this.props.classes.datePicker}
              value={this.state.queryParams.date_start}
              onChange={this.handleQueryChange("date_start")}
              disableFuture={true}
              keyboard
              label="Choose a start date"
            />
            <DatePicker
              className={this.props.classes.datePicker}
              value={this.state.queryParams.date_end}
              onChange={this.handleQueryChange("date_end")}
              disableFuture={true}
              keyboard
              label="Choose a end date"
            />
            <TextField
              id="select-category"
              select
              label="Category"
              className={this.props.classes.textField}
              value={this.state.queryParams.category}
              onChange={this.handleQueryChange("category")}
              SelectProps={{
                native: true,
              }}
              margin="normal"
            >
              <option key={"0"} value={""} />
              {this.state.categories.map(category => (
                <option key={category.pk} value={category.pk}>
                  {category.category}
                </option>
              ))}
            </TextField>
            <TextField
              id="select-rating"
              select
              label="Rating"
              className={this.props.classes.textField}
              value={this.state.queryParams.quality_rating}
              onChange={this.handleQueryChange("quality_rating")}
              SelectProps={{
                native: true,
              }}
              margin="normal"
            >
              <option key={"0"} value={""} />
              {this.state.qualityRatings.map(rating => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </TextField>
            <TextField
              id="filter-entries"
              label="Entry Text Contains"
              className={this.props.classes.textField}
              value={this.state.queryParams.entry}
              onChange={this.handleQueryChange("entry")}
              margin="normal"
              multiline
            >
            </TextField>
          </Drawer>

          <InfiniteScroll
            hasMore={this.state.moreEntriesUrl ? true : false}
            loader={<CustomProgress />}
            initialLoad={false}
            loadMore={this.loadMoreEntries}
          >
            <div className={this.props.classes.root}>
              {entryWidgets}
            </div>
          </InfiniteScroll>
        </React.Fragment>
      )
    }
  }

}

export default withStyles(styles)(HistoryView);
