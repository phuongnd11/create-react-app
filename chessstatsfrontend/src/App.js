import React, { Component } from 'react';
import './App.css';

import OpeningApp from './component/OpeningApp';

class App extends Component {
  render() {
    return (
      <div className="container">
        <OpeningApp />
      </div>
    );
  }
}

export default App;