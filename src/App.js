import React, { Component } from 'react';
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
  }

  componentDidMount() {
    const queryString = qs.parse(window.location.search);
    const apiKey = queryString.api_key;
    this.setState({apiKey});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.apiKey && prevState.query !== this.state.query) this.fetch();
  }

  fetch() {
    const {query} = this.state;
    const endpoint = 'https://services-edu.herokuapp.com/youtube/search';
    const url = `${endpoint}?part=snippet&q=${query}`;

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
        <div>When you get one, add it to the URL like `localhost:3000/videos?api_key=abc`</div>
      </div>
    );
  }

  renderSearch() {
    const {error, json, query} = this.state;
    return (
      <div>
        <div>search: <input onChange={this.onQueryChange} type="text" value={query} /></div>
        {json && this.renderJson(json)}
        {error && <div>error: {JSON.stringify(error, null, 2)}</div>}
      </div>
    );
  }

  renderJson(json) {
    return (
      <div>
        {json.items.map(item => (
          <div key={JSON.stringify(item.id)}>
            <div>{item.snippet.title}</div>
            <div>{item.snippet.description}</div>
            <div><img src={item.snippet.thumbnails.default.url} alt="thumbnail" /></div>
          </div>
        ))}
      </div>
    );
  }
}
