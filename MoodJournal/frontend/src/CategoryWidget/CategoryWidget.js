import React, {Component} from 'react';
import axios from 'axios';

class CategoryWidget extends Component {
  constructor(props) {
    super(props);
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
  }

  onDeleteBtnClick(e) {
    this.props.onDeleteBtnClick(this.props.url);
  }

  render() {
    return (
      <li>
        {this.props.category}
        <button type="button" onClick={this.onDeleteBtnClick}>Delete</button>
      </li>
    );
  }
}


export default CategoryWidget
