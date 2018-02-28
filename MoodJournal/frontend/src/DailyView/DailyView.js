import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';

import EntryWidget from '../EntryWidget/EntryWidget.js';
import EntryCreator from '../EntryCreator/EntryCreator.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// >:|
function getToday() {
  let today = new Date();
  let dd = today.getDate().toString();
  let mm = (today.getMonth() + 1).toString();
  let yyyy = today.getFullYear().toString();

  dd = dd.length === 1 ? "0" + dd : dd;
  mm = mm.length === 1 ? "0" + mm : mm;
  let date = yyyy + "-" + mm + "-" + dd;

  return date;
}

const styles = theme => ({
  root: {
    margin: '25px auto 0px',
    width: '100%',
    maxWidth: 720,
    backgroundColor: theme.palette.background.paper,
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
      entries: []
    };
    this.getCategoryName = this.getCategoryName.bind(this);
    this.getUnusedCategories = this.getUnusedCategories.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    let baseUrl = '/api/entries/';
    let queryString = '?date=' + getToday();
    let fullUrl = baseUrl + queryString;

    axios.get(fullUrl)
      .then(
        (response) => {
          this.setState({
            entries: response.data
          });
          return axios.get('/api/categories/')
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
      .then(
        (response) => {
          this.setState({
            isLoaded: true,
            categories: response.data
          });
          return axios.get('/api/quality-ratings/')
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
      .then(
        (response) => {
          this.setState({
            qualityRatings: response.data
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

  getUnusedCategories() {
    let usedCategories = this.state.entries.map(entry => entry.category);
    let unusedCategories = this.state.categories.filter(category => !(usedCategories.includes(category.pk)));
    return unusedCategories;
  }

  getCategoryName(pk) {
    let categoryObject = this.state.categories.find(category => category.pk === pk);
    return categoryObject.category
  }

  render() {
    const { error, isLoaded, entries, qualityRatings } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;  // TODO loading icon
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
          <EntryCreator
            date={getToday()}
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
