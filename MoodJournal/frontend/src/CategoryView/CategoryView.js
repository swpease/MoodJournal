import React, {Component} from 'react';

import CategoryWidget from '../CategoryWidget/CategoryWidget.js'


class CategoryView extends Component {
  render() {
    let categories = this.props.data.map(datum =>
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

export default CategoryView
