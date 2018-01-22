import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  onClick(e) {
    console.log("Sending GET API call.");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button type="button" onClick={this.onClick}>
          Send GET /categories
        </button>
      </div>
    );
  }
}

export default App;
