import React, {Component} from 'react';
import List from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


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
    // this.handleDelete = this.handleDelete.bind(this);
    // this.handleCreate = this.handleCreate.bind(this);
    // this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    axios.get('/api/entries/')
      .then(
        (response) => {
          this.setState({
            isLoaded: true,
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

  render() {
    const { error, isLoaded, entries } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;  // TODO loading icon
    } else {
      let entriesWidgets = entries.map(datum =>
        <div key={datum.url}>
        {datum.entry}
        </div>
      );
      // TODO do I want to just put the CategoryCreator in the List?
      return (
        <div className={this.props.classes.root}>
          <List>{entriesWidgets}</List>
        </div>
      )
    }
  }
}

export default withStyles(styles)(DailyView);
