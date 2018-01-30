import React, { Component } from 'react';
import Button from 'material-ui/Button';


import 'typeface-roboto';

import CategoryView from './CategoryView/CategoryView.js';


class App extends Component {
  constructor(props) {
    super(props);
    // Will have one state per top-level view:
    //     - default    : welcome page
    //     - categories : categories list
    //     - daily      : entries for a given date
    //     - search     : search / filter entries
    this.state = {
      view: 'default',
    };
    this.handleCategoriesBtnClick = this.handleCategoriesBtnClick.bind(this)
  }

  handleCategoriesBtnClick(e) {
    this.setState({
      view: 'categories'
    });
  }

  render() {
    let view = null;
    if (this.state.view == 'categories') {
      view = (
        <CategoryView></CategoryView>
      )
    }

    return (
      <div className="App">
        <Button type="button"
          onClick={this.handleCategoriesBtnClick}
          color="primary"
          raised>
            Send GET /categories
        </Button>
        <button type="button" onClick={this.handleCategoriesBtnClick}>
          Send GET /categories
        </button>
        {view}
      </div>
    );
  }
}

export default App;
