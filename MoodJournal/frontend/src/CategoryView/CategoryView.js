import React, {Component} from 'react';
import List from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';

import CategoryWidget from '../CategoryWidget/CategoryWidget.js'
import CategoryCreator from '../CategoryCreator/CategoryCreator.js'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const styles = theme => ({
  root: {
    margin: '25px auto 0px',
    width: '100%',
    maxWidth: 360, // TODO increase if there's a long category name.
    backgroundColor: theme.palette.background.paper,
  },
});


class CategoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: []
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    axios.get('/api/categories')
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

  // Create, Update, Delete handlers.
  handleCreate(e, category, onSuccess, onError) {
    axios.post('/api/categories/', {category: category})
      .then(
        (response) => {
          onSuccess();
          this.setState((prevState) => {
            return {data: prevState.data.concat([response.data])};
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

  handleUpdate(e, category, url, onSuccess) {
    console.log("UPDATE: ", category, url, e)
  }

  handleDelete(url) {
    axios.delete(url)
      .then(
        (response) => {
          this.setState((prevState) => {
            return {data: prevState.data.filter(datum => datum.url !==  url)}
          });
        },
        (error) => {
          this.setState({
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
      return <div>Loading...</div>;
    } else {
      let categories = data.map(datum =>
        <CategoryWidget
          key={datum.url}
          url={datum.url}
          rank={datum.rank}
          category={datum.category}
          handleDelete={this.handleDelete}>
        </CategoryWidget>
      );

      return (
        <div className={this.props.classes.root}>
          <List disablePadding>{categories}</List>
          <CategoryCreator handleCreate={this.handleCreate}></CategoryCreator>
        </div>
      )
    }
  }
}

export default withStyles(styles)(CategoryView)
