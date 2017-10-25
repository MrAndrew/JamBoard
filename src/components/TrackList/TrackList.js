import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.makeTracksArray = this.makeTracksArray.bind(this);
  // }
  //
  // makeTracksArray(this.props.tracks) {
  //   if(this.props.tracks) {
  //     let tracksArray = this.props.tracks.map( //search button causing failure
  //               track => {
  //                 return <Track key={track.id} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>;
  //               });
  //     return tracksArray;
  //   } else {
  //     return <h1>No tracks here!</h1>;
  //   }
  // };
  //
  // render () {
  //   return (
  //     <div className="TrackList">
  //       {this.makeTracksArray}
  //     </div>
  //   )
  // }

  render () {
    console.log(this.props.tracks);
    return (
      <div className="TrackList">
        {
         this.props.tracks.map( //search button causing failure
           track => {
             return <Track key={track.id} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>;
           }
         )
       }
      </div>
    );
  }
}

export default TrackList;
