import React from 'react';
import './PlayList.css';
import TrackList from '../TrackList/TrackList';

class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
//changes name of the playlist and passes the value to props in App.js
  handleNameChange(e) {
    const name = e.target.value;
    this.props.onNameChange(name);
  }
//displays the current tracks in the playlist added by the user
  render () {
    return (
      <div className="Playlist">
        <input onChange={this.handleNameChange} defaultValue={'Type Playlist Name Here'}/>
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default PlayList;
