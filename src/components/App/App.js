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
        {Name: 'Example Song 1', Artist: 'Artist One', Album: 'Album', ID: 1},
        {Name: 'Example Song 2', Artist: 'Artist Two', Album: 'Album', ID: 2},
        {Name: 'Example Song 3', Artist: 'Artist Three', Album: 'Album', ID: 3}
      ],
      playlistName: 'Type Playlist Name Here',
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(searchTerm) {
    console.log(searchTerm);
    Spotify.searchSpotify(searchTerm).then(searchedTrackArray => {
      if (searchedTrackArray !== undefined) {
        console.log(searchedTrackArray);
        this.setState({searchResults: searchedTrackArray});
      } else {
        this.setState({searchResults: []});
      }
    });
  }
//called on button press "Save To Spotify"
  savePlaylist() {
    //have save this way because the tracks are an array of objects and you want
    //an array of values from the key 'URI'
    const trackURIs = this.state.playlistTracks.map(uri => uri.URI);
    console.log(trackURIs);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({ playlistName: 'Type Playlist Name Here' });
    this.setState({ searchResults: [] });
  }
//updates the state value to the current name entered by the user dynamically
//only problem is that it's called with each button press from the user (thus
// state is being changed with each key press from the user)
  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }
//puts tracks from search into the playlist
  addTrack(track) {
    if(this.state.playlistTracks.indexOf(track) === -1) {
      this.state.playlistTracks.push(track);
      this.setState({ playlistTracks: this.state.playlistTracks });
    }
  }
//removes a track from the playlist
  removeTrack(track) {
    if(this.state.playlistTracks.indexOf(track) !== -1) {
      this.state.playlistTracks.pop(track);
      this.setState({ playlistTracks: this.state.playlistTracks })
    }
  }
//renders the search and create playlist UI page interface
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
