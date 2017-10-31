import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
//This render method creates the tracks in a list format from the array of objects stored
//in the state of the App.js Component which can be used by both searchResults and
//the current tracks in PlayList
  render () {
    //console.log(this.props.tracks);
    return (
      <div className="TrackList">
        {
         this.props.tracks.map(
           track => {
             return <Track key={track.ID} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>;
           }
         )
       }
      </div>
    );
  }
}

export default TrackList;
