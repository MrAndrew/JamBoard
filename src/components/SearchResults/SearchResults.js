import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
  //displays the searchResults from Spotify
  render () {
    return (
      <div className="SearchResults">
        <h2>Search Results:</h2>
        <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false}/>
      </div>
    );
  }
}

export default SearchResults;
