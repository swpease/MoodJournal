import React, {Component} from 'react';

import axios from 'axios';

import CategoryWidget from '../CategoryWidget/CategoryWidget.js'


class CategoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: []
    }
  }

  componentDidMount() {
    axios.get('/api/categories')
        .then(response => {
          this.setState({
            isLoaded: true,
            data: response.data
          });
        }) // TODO (error) as second arg.: see docs/faq-ajax
        .catch(err => {
          console.log(err);
        });
  }
  render() {
    const { error, isLoaded, data } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let categories = this.state.data.map(datum =>
        <CategoryWidget
          key={datum.url}
          url={datum.url}
          rank={datum.rank}
          category={datum.category}>
        </CategoryWidget>
      );

      return (
        <ul>{categories}</ul>
      )
    }
  }
}

export default CategoryView
