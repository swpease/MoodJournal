import React, {Component} from 'react';
import PropTypes from 'prop-types';
import List from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';

import CustomProgress from '../CustomProgress/CustomProgress.js';
import CategoryWidget from '../CategoryWidget/CategoryWidget.js';
import CategoryCreator from '../CategoryCreator/CategoryCreator.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const styles = theme => ({
  root: {
    margin: '25px auto 0px',
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  progressWrapper: {
    display: 'flex',
  },
  progress: {
    margin: '25px auto 0px',
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

  // https://reactjs.org/docs/faq-ajax.html
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

  handleUpdate(e, category, url, onSuccess, onError) {
    axios.patch(url, {category: category})
      .then(
        (response) => {
          onSuccess();
          this.setState((prevState) => {
            let oldData = prevState.data
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
      return (
        <div>
          <CustomProgress />
        </div>
      );
    } else {
      let categories = data.map(datum =>
        <CategoryWidget
          key={datum.url}
          url={datum.url}
          rank={datum.rank}
          category={datum.category}
          handleDelete={this.handleDelete}
          handleUpdate={this.handleUpdate}>
        </CategoryWidget>
      );
      return (
        <div className={this.props.classes.root}>
          <List disablePadding>
            {categories}
            <CategoryCreator handleCreate={this.handleCreate}></CategoryCreator>
          </List>
        </div>
      )
    }
  }
}

CategoryView.propTypes = {
  handleBadToken: PropTypes.func.isRequired,
}

export default withStyles(styles)(CategoryView)
