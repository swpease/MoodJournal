import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';
import moment from 'moment';
import { DatePicker } from 'material-ui-pickers';

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
  datePicker: {
    margin: '10px',
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
    };
    this.getCategoryName = this.getCategoryName.bind(this);
  }

  componentDidMount() {
    axios.get('/api/entries/')
      .then(
        (response) => {
          this.setState({
            entries: response.data.results,
            moreEntriesUrl: response.data.next,
            entriesCount: response.data.count,
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
          {entryWidgets}
        </div>
      )
    }
  }

}

export default withStyles(styles)(HistoryView);
