import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const KEY = 'AIzaSyCsnowZbjZ7Sap02rPMRZ05aWFcbvk1CeU';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      error: null,
      json: null
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onFetchDone = this.onFetchDone.bind(this);
    this.onFetchError = this.onFetchError.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) this.fetch();
  }

  fetch() {
    const {query} = this.state;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${KEY}`;
    fetch(url)
      .then(response => response.json())
      .then(this.onFetchDone)
      .catch(this.onFetchError);
  }

  onQueryChange(e) {
    const query = e.target.value;
    this.setState({query});
  }

  onFetchDone(json) {
    console.log('json', json);
    this.setState({json});
  }

  onFetchError(error) {
    this.setState({error});
  }

  render() {
    const {error, json, query} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <div>query: <input onChange={this.onQueryChange} type="text" value={query} /></div>
            <div>error: {error && JSON.stringify(error, null, 2)}</div>
            <div>json: {json && this.renderJson(json)}</div>
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

  renderJson(json) {
    return (
      <div>
        {json.items.map(item => (
          <div>
            <div>{item.snippet.title}</div>
            <div>{item.snippet.description}</div>
            <div><img src={item.snippet.thumbnails.default.url} alt="thumbnail" /></div>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
