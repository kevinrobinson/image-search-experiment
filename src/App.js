import React, { Component } from 'react';
import _ from 'lodash';
import qs from 'query-string';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      error: null,
      json: null,
      apiKey: null
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onFetchDone = this.onFetchDone.bind(this);
    this.onFetchError = this.onFetchError.bind(this);
    this.throttledFetch = _.throttle(this.throttledFetch, 100);
  }

  componentDidMount() {
    const queryString = qs.parse(window.location.search);
    const apiKey = queryString.api_key;
    this.setState({apiKey});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.apiKey && prevState.query !== this.state.query) {
      this.throttledFetch();
    }
  }

  throttledFetch() {
    const {query} = this.state;
    const endpoint = process.env.REACT_APP_ENDPOINT || 'http://localhost:5000/images/search';
    const url = `${endpoint}?q=${query}`;

    const headers = {'X-Services-Edu-Api-Key': 'abc'};
    fetch(url, {headers})
      .then(response => response.json())
      .then(this.onFetchDone)
      .catch(this.onFetchError);
  }

  onQueryChange(e) {
    const query = e.target.value;
    this.setState({query});
  }

  onFetchDone(json) {
    this.setState({json});
  }

  onFetchError(error) {
    this.setState({error});
  }

  render() {
    const {apiKey} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          {!apiKey ? this.renderMissingApiKey() : this.renderSearch()}
        </header>
      </div>
    );
  }

  renderMissingApiKey() {
    return (
      <div>
        <div>You need an API key to get started.</div>
        <div>When you get one, add it to the URL like `localhost:3000/use?api_key=abc`</div>
      </div>
    );
  }

  renderSearch() {
    const {error, json, query} = this.state;
    return (
      <div>
        <div>search images: <input onChange={this.onQueryChange} type="text" value={query} /></div>
        {json && this.renderJson(json)}
        {error && <div>error: {JSON.stringify(error, null, 2)}</div>}
      </div>
    );
  }

  renderJson(json) {
    return (
      <div>
        {json.items.map(item => (
          <div className="App-image" key={item.link}>
            <img
              src={item.image.thumbnailLink}
              alt={item.title}
              width={item.image.thumbnailWidth}
              height={item.image.thumbnailHeight}
            />
            <div className="App-image-source">
              <span>from </span>
              <a className="App-image-link" href={item.image.contextLink} target="_blank" rel="noopener noreferrer">{item.displayLink}</a>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
