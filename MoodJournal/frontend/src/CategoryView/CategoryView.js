import React, {Component} from 'react';
import axios from 'axios';

import CategoryWidget from '../CategoryWidget/CategoryWidget.js'


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class CategoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: []
    };
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
  }

  onDeleteBtnClick(url) {
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
          onDeleteBtnClick={this.onDeleteBtnClick}>
        </CategoryWidget>
      );

      return (
        <ul>{categories}</ul>
      )
    }
  }
}

export default CategoryView
