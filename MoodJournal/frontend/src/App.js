import React, { Component } from 'react';

import axios from 'axios';

import logo from './logo.svg';
import './App.css';
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
      data: []
    };
    this.handleCategoriesBtnClick = this.handleCategoriesBtnClick.bind(this)
  }

  handleCategoriesBtnClick(e) {
    axios.get('/api/categories')
        .then(response => {
          this.setState({
            view: 'categories',
            data: response.data
          });
        })
        .catch(err => {
          console.log(err);
        });
  }

  render() {
    let view = null;
    if (this.state.view == 'categories') {
      view = (
        <CategoryView data={this.state.data}></CategoryView>
      )
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button type="button" onClick={this.handleCategoriesBtnClick}>
          Send GET /categories
        </button>
        {view}
      </div>
    );
  }
}

export default App;