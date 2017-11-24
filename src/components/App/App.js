import React, {Component} from 'react';
import './App.css';
import PlayList from '../PlayList/PlayList';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import SearchFilters from '../SearchFilters/SearchFilters';
import Spotify from '../../util/Spotify';
import Slider from 'react-rangeslider';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FilterRange: 30,
      DanceabilitySelected: false,
      DanceabilityValue: 50,
      EnergySelected: false,
      EnergyValue: 50,
      LivenessSelected: false,
      LivenessValue: 50,
      searchResults: [
      ],
      playlistName: 'Type Playlist Name Here',
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.handleDanceabilityValueChange = this.handleDanceabilityValueChange.bind(this);
    this.handleEnergyValueChange = this.handleEnergyValueChange.bind(this);
    this.handleLivenessValueChange = this.handleLivenessValueChange.bind(this);
    this.inRange = this.inRange.bind(this);
    this.filterTracks = this.filterTracks.bind(this);
    this.cleanArray = this.cleanArray.bind(this);
    this.handleDanceabilitySelect = this.handleDanceabilitySelect.bind(this);
    this.handleEnergySelect = this.handleEnergySelect.bind(this);
    this.handleLivenessSelect = this.handleLivenessSelect.bind(this);
    this.handleFilterRangeChange = this.handleFilterRangeChange.bind(this);
  }

  inRange(value, target) { //value is from AF, target is from state
    let range = this.state.FilterRange;
    value = value * 100; //to convert from decimal integer provided by spotify's
    // track audio_features to match our values out of 100
    if (value < target + range && value > target - range) {
      return true;
    } else {
      return false;
    }
  }

  search(searchTerm) {
    //console.log(searchTerm);
    if(!this.state.DanceabilitySelected && !this.state.EnergySelected && !this.state.LivenessSelected) {
      //console.log(`no filters selected`);
      Spotify.searchSpotify(searchTerm).then(searchedTrackArray => {
        if (searchedTrackArray !== undefined) {
          //console.log(searchedTrackArray);
          this.setState({searchResults: searchedTrackArray});
        } else {
          this.setState({searchResults: []});
        }
      });
    } else if(this.state.DanceabilitySelected || this.state.EnergySelected || this.state.LivenessSelected) {
      //console.log(`Danceability selected?: ${this.state.DanceabilitySelected}`);
      //console.log(`Energy selected?: ${this.state.EnergySelected}`);
      //console.log(`Liveness selected?: ${this.state.LivenessSelected}`);
      Spotify.searchSpotify(searchTerm).then(searchedTrackArray => {
        if (searchedTrackArray !== undefined) {
          //console.log(searchedTrackArray);
          let searchedIDs = searchedTrackArray.map(track => track.ID);
          //console.log(searchedIDs);
          Spotify.getAudioFeatures(searchedIDs).then(audioFeaturesArray => {
            if (audioFeaturesArray !== undefined) {
              //PROBLEM IS audioFeaturesArray IS AN ARRAY OF ARRAYS!!!
              //console.log(`audioFeaturesArray: ${audioFeaturesArray}`);
              this.filterTracks(audioFeaturesArray, searchedTrackArray);
            } else {
              console.log(`undefined audio features returned from spotify`);
            }
          }
        ).catch(error => {
          console.log(`proplem getting audio features`);
        })
      } else {
        console.log(`undefined search results from spotify`);
      }
    }).catch(error => {
      console.log(`proplem getting search results`);
    })
    } //ends filter selection code
  } //ends search function, called on button press "SEARCH"

  filterTracks(AFArray, STArray) {
    //console.log(`audioFeatureResults passed into filterTracks method: ${AFArray}`);
    //console.log(`searchResults passed into filterTracks method: ${STArray}`);
    let filteredTrackIDs = AFArray.map(featureSet => { //CURRENTLY CHECKS ALL THREE FEATURES, NEEDS TO CHECK ONLY FEATURES SELECTED BY USER
      //checks if all 3 filters are selected
      if ( this.state.DanceabilitySelected && this.inRange(featureSet.Danceability, this.state.DanceabilityValue)
        && this.state.EnergySelected && this.inRange(featureSet.Energy, this.state.EnergyValue)
        && this.state.LivenessSelected && this.inRange(featureSet.Liveness, this.state.LivenessValue) )
      {
        return featureSet.ID;
        //checks if  (2) Energy and Liveness are selected
      } else if ( !this.state.DanceabilitySelected
        && this.state.EnergySelected && this.inRange(featureSet.Energy, this.state.EnergyValue)
        && this.state.LivenessSelected && this.inRange(featureSet.Liveness, this.state.LivenessValue) )
      {
        return featureSet.ID;
      //checks if (2) Liveness and Danceability are selected
    } else if ( this.state.DanceabilitySelected && this.inRange(featureSet.Danceability, this.state.DanceabilityValue)
        && !this.state.EnergySelected
        && this.state.LivenessSelected && this.inRange(featureSet.Liveness, this.state.LivenessValue) )
      {
        return featureSet.ID;
        //checks if (2) Energy and Danceability are selected
      } else if ( this.state.DanceabilitySelected && this.inRange(featureSet.Danceability, this.state.DanceabilityValue)
        && this.state.EnergySelected && this.inRange(featureSet.Energy, this.state.EnergyValue)
        && !this.state.LivenessSelected )
      {
        return featureSet.ID;
        //checks if (1) Danceability is selected
      } else if ( this.state.DanceabilitySelected && this.inRange(featureSet.Danceability, this.state.DanceabilityValue)
        && !this.state.EnergySelected
        && !this.state.LivenessSelected )
      {
        return featureSet.ID;
        //checks if (1) Energy is selected
      } else if ( !this.state.DanceabilitySelected
        && this.state.EnergySelected && this.inRange(featureSet.Energy, this.state.EnergyValue)
        && !this.state.LivenessSelected )
      {
        return featureSet.ID;
        //checks if (1) Liveness is selected
      } else if ( !this.state.DanceabilitySelected
        && !this.state.EnergySelected
        && this.state.LivenessSelected && this.inRange(featureSet.Liveness, this.state.LivenessValue) )
      {
        return featureSet.ID;
      };
    });
    filteredTrackIDs = this.cleanArray(filteredTrackIDs);
    //console.log(`filteredTrackIDs: ${filteredTrackIDs}`);
    let refinedSearchResults = STArray.map(function(track) {
      let i = 0;
      while (i < filteredTrackIDs.length) {
        if (track.ID === filteredTrackIDs[i]) {
          return track;
        };
        i++;
      };
    });
    refinedSearchResults = this.cleanArray(refinedSearchResults);
    //console.log(`refined results: ${refinedSearchResults}`);
    this.setState({searchResults: refinedSearchResults});
  }

  cleanArray(actual) {
    let newArray = new Array();
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }

//called on button press "Save To Spotify"
  savePlaylist() {
    //have save this way because the tracks are an array of objects and you want
    //an array of values from the key 'URI'
    const trackURIs = this.state.playlistTracks.map(uri => uri.URI);
    //console.log(trackURIs);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({ playlistName: 'Type Playlist Name Here' });
    this.setState({ searchResults: [] });
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
      let index = this.state.playlistTracks.indexOf(track);
      this.state.playlistTracks.splice(index, 1);
      this.setState({ playlistTracks: this.state.playlistTracks })
    }
  }
//updates the state value to the current name entered by the user dynamically
//only problem is that it's called with each button press from the user (thus
// state is being changed with each key press from the user)
  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }
//all the handle methods for Component props
  handleFilterRangeChange(e) {
    this.setState({FilterRange: Math.round(e)});
  }

  handleDanceabilityValueChange(e) {
    this.setState({DanceabilityValue: Math.round(e)});
  }

  handleEnergyValueChange(e) {
    this.setState({EnergyValue: Math.round(e)});
  }

  handleLivenessValueChange(e) {
    this.setState({LivenessValue: Math.round(e)});
  }

  handleRangeValueChange(e) {
    this.setState({RangeValue: Math.round(e)});
  }
  handleDanceabilitySelect(e) {
    this.setState({DanceabilitySelected: e});
  }
  handleEnergySelect(e) {
    this.setState({EnergySelected: e});
  }
  handleLivenessSelect(e) {
    this.setState({LivenessSelected: e});
  }

//renders the search and create playlist UI page interface
  render() {
    return (
      <div>
        <h1>Mr. <span className="highlight">Andrew's</span> JamBoard</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <h2> Select audio features to search for :</h2>
          <div className="FilterRange">
            <p>Filter Values within a range of:</p>
            <Slider value={this.state.FilterRange} orientation="horizontal" onChange={this.handleFilterRangeChange} />
          </div>
          <SearchFilters
            DanceabilitySelect={this.handleDanceabilitySelect}
            EnergySelect={this.handleEnergySelect}
            LivenessSelect={this.handleLivenessSelect}h
            DanceabilityValue={this.state.DanceabilityValue}
            EnergyValue={this.state.EnergyValue}
            LivenessValue={this.state.LivenessValue}
            handleDanceabilityValueChange={this.handleDanceabilityValueChange}
            handleEnergyValueChange={this.handleEnergyValueChange}
            handleLivenessValueChange={this.handleLivenessValueChange} />
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
