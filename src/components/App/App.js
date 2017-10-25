import React from 'react';
import './App.css';
import PlayList from '../PlayList/PlayList';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {name: 'searchName1', artist: 'artist', album: 'album'},
        {name: 'searchName2', artist: 'artist', album: 'album'},
        {name: 'searchName3', artist: 'artist', album: 'album'}
      ],
      playlistName: 'Sample Playlist Name',
      playlistTracks: [
        {name: 'name1', artist: 'artist', album: 'album'},
        {name: 'name2', artist: 'artist', album: 'album'},
        {name: 'name3', artist: 'artist', album: 'album'},
      ],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(searchTerm) {
    console.log(searchTerm);
    let searchedTrackArray = Spotify.searchSpotify(searchTerm);
    if (searchedTrackArray !== undefined) {
      this.setState({searchResults: searchedTrackArray});
    } else {
      this.setState({searchResults: []});
    }
  }

  savePlaylist() {
    const trackURIs = [];
    this.state.playlistTracks.map(uri => trackURIs.push(uri));
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({ playlistName: 'New Playlist' });
    this.setState({ searchResults: [] });
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  addTrack(track) {
    if(this.state.playlistTracks.indexOf(track.id) === -1) {
      this.state.playlistTracks.push(track);
    }
  }

  removeTrack(track) {
    if(this.state.playlistTracks.indexOf(track.id) != -1) {
      this.state.playlistTracks.pop(this.state.playlistTracks.indexOf(track.id));
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <PlayList playlistTracks={this.state.playlistTracks} onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} playlistName={this.state.playlistName} onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
