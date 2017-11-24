import React from 'react';
import './SearchFilters.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

class SearchFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DanceabilitySelected: false,
      DanceBGcolor: {backgroundColor: '#0e35f7'},
      EnergySelected: false,
      EnergyBGcolor: {backgroundColor: '#0e35f7'},
      LivenessSelected: false,
      LivenessBGcolor: {backgroundColor: '#0e35f7'},
    };
    this.toggleDanceability = this.toggleDanceability.bind(this);
    this.toggleEnergy = this.toggleEnergy.bind(this);
    this.toggleLiveness = this.toggleLiveness.bind(this);
    this.handleMouseOverDance = this.handleMouseOverDance.bind(this);
    this.handleMouseOverEnergy = this.handleMouseOverEnergy.bind(this);
    this.handleMouseOverLive = this.handleMouseOverLive.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  toggleDanceability() {
    if (!this.state.DanceabilitySelected) {
      this.setState({DanceabilitySelected: true});
      this.props.DanceabilitySelect(true);
      this.setState({DanceBGcolor: {backgroundColor: '#f70e0e'}});
    } else if (this.state.DanceabilitySelected) {
      this.setState({DanceabilitySelected: false});
      this.props.DanceabilitySelect(false);
      this.setState({DanceBGcolor: {backgroundColor: '#0e35f7'}});
    }
  }
  toggleEnergy() {
    if (!this.state.EnergySelected) {
      this.setState({EnergySelected: true});
      this.props.EnergySelect(true);
      this.setState({EnergyBGcolor: {backgroundColor: '#f70e0e'}});
    } else if (this.state.EnergySelected) {
      this.setState({EnergySelected: false});
      this.props.EnergySelect(false);
      this.setState({EnergyBGcolor: {backgroundColor: '#0e35f7'}});
    }
  }
  toggleLiveness() {
    if (!this.state.LivenessSelected) {
      this.setState({LivenessSelected: true});
      this.props.LivenessSelect(true);
      this.setState({LivenessBGcolor: {backgroundColor: '#f70e0e'}});
    } else if (this.state.LivenessSelected) {
      this.setState({LivenessSelected: false});
      this.props.LivenessSelect(false);
      this.setState({LivenessBGcolor: {backgroundColor: '#0e35f7'}});
    }
  }
  handleMouseOverDance() {
    this.setState({DanceBGcolor: {backgroundColor: '#00a015'}})
  }
  handleMouseOverEnergy() {
    this.setState({EnergyBGcolor: {backgroundColor: '#00a015'}})
  }
  handleMouseOverLive() {
    this.setState({LivenessBGcolor: {backgroundColor: '#00a015'}})
  }
  handleMouseLeave() {
    if(this.state.DanceabilitySelected) {
      this.setState({DanceBGcolor: {backgroundColor: '#f70e0e'}})
    }
    if(!this.state.DanceabilitySelected) {
      this.setState({DanceBGcolor: {backgroundColor: '#0e35f7'}})
    }
    if(this.state.EnergySelected) {
      this.setState({EnergyBGcolor: {backgroundColor: '#f70e0e'}})
    }
    if(!this.state.EnergySelected) {
      this.setState({EnergyBGcolor: {backgroundColor: '#0e35f7'}})
    }
    if(this.state.LivenessSelected) {
      this.setState({LivenessBGcolor: {backgroundColor: '#f70e0e'}})
    }
    if(!this.state.LivenessSelected) {
      this.setState({LivenessBGcolor: {backgroundColor: '#0e35f7'}})
    }
  }

  render () {
    return (
      <div className="SearchFilters">

        <div className="slidecontainer">
          <a
            onMouseOver={this.handleMouseOverDance}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.toggleDanceability}
            style={this.state.DanceBGcolor}>
              Danceability
          </a>
          <Slider value={this.props.DanceabilityValue} orientation="vertical" onChange={this.props.handleDanceabilityValueChange} />
        </div>

        <div className="slidecontainer">
          <a
            onMouseOver={this.handleMouseOverEnergy}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.toggleEnergy}
            style={this.state.EnergyBGcolor}>
            Energy
          </a>
          <Slider value={this.props.EnergyValue} orientation="vertical" onChange={this.props.handleEnergyValueChange} />
        </div>

        <div className="slidecontainer">
          <a
            onMouseOver={this.handleMouseOverLive}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.toggleLiveness}
            style={this.state.LivenessBGcolor}>
            Liveness
          </a>
          <Slider value={this.props.LivenessValue} orientation="vertical" onChange={this.props.handleLivenessValueChange} />
        </div>

      </div>
    )
  }


}

export default SearchFilters;
