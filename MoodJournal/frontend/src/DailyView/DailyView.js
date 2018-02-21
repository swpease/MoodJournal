import React, {Component} from 'react';
import List from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


class DailyView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: []
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
            data: response.data
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
    const { error, isLoaded, data } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;  // TODO loading icon
    } else {
      let entries = data.map(datum =>
        <div key={datum.url}>
        {datum.entry}
        </div>
      );
      // TODO do I want to just put the CategoryCreator in the List?
      return (
        <List>{entries}</List>
      )
    }
  }
}

export default DailyView;
