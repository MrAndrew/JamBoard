
const clientID = '78272ce624b84226a22f0f3dc2111fa0';
const redirectURI = 'https://jamboard.surge.sh/';
let userAccessToken;

const Spotify = {

  savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs) {
      return;
    }
    let access_token = userAccessToken;
    let headers = {
      Authorization: `Bearer ${access_token}`
    };
    let postHeaders = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    };
    let userID;
    let playlistID;
    //fetch user id
    fetch(`https://api.spotify.com/v1/me`,
      {
        headers: headers
      }
    ).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    if(jsonResponse.id) {
      return jsonResponse.id;
    }
  }).then(userID => {
  //fetch POST to save/create a playlist to the user's account with userID returned from
  //previous POST fetch request
  fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      method: 'POST',
      headers: postHeaders,
      body: JSON.stringify({
        name: playlistName,
      }),
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('POST playlist request failed!');
  }, networkError => console.log(networkError.message)
).then(jsonResponse => {
  if (jsonResponse.id) {
    return jsonResponse.id;
  }
}).then(playlistID => {
    //fetch POST to add tracks to the playlist with previous POST fetch return of
    //userID and playlistID values
    fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
         method: 'POST',
         headers: postHeaders,
         body: JSON.stringify({
           uris: trackURIs,
         }),
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('POST tracks request failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      //An alert message to let the user know the playlist was saved successfully
      window.alert('Successfully added your playlist, check your Spotify account!');
    })
  })
})

},//end savePlaylist method

  searchSpotify(searchTerm) {
    if (!userAccessToken) {
      this.getAccessToken();
    };
    //console.log(userAccessToken);
    return fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=50`,
      {
        headers: {Authorization: `Bearer ${userAccessToken}`}
      }
    ).then(response => {
      if (response.ok) {
        return response.json();
      }
      console.log("request failed");
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    //console.log(`track json response ${jsonResponse.tracks.items}`);
    if (jsonResponse.tracks) {
      return jsonResponse.tracks.items.map(track => ({
        ID: track.id,
        Name: track.name,
        Artist: track.artists[0].name,
        Album: track.album.name,
        URI: track.uri,
      }))
    }
  }).catch(error => {
  console.log(error);
});
},//end searchSpotify method

getAudioFeatures(trackIDs) {
  trackIDs = trackIDs.join(',');
  //console.log(`these are the trackIDs: ${trackIDs}`);
  if (!userAccessToken) {
    this.getAccessToken();
  };
  return fetch(`https://api.spotify.com/v1/audio-features/?ids=${trackIDs}`,
    {
      headers: {Authorization: `Bearer ${userAccessToken}`}
    }
  ).then(response => {
    if (response.ok) {
        return response.json();
      }
      console.log("request failed");
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    //console.log(`audio_features jsonResponse: ${jsonResponse.audio_features}`);
    //console.log(``);
    if (jsonResponse.audio_features) {
      //in case one of the tracks doesn't contain audio_features
      let rawAFArray = jsonResponse.audio_features.filter(trackAF => (trackAF !== null));
      return rawAFArray.map(trackAF => ({
        ID: trackAF.id,
        Danceability: trackAF.danceability,
        Energy: trackAF.energy,
        Liveness: trackAF.liveness,
      }))
    }
  }).catch(error => {
  console.log(error);
});
}, //end getAudioFeatures method

//redirect to sign in page & asks permission to modify user playlists if not already done
  getAccessToken() {
    if(userAccessToken) {
      return new Promise(resolve => resolve(userAccessToken));
    }
      const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
      const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
      if (urlAccessToken && urlExpiresIn) {
        userAccessToken = urlAccessToken[1];
        let expiresIn = urlExpiresIn[1];
        window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      //reccomend adding a state to ensure to ensure valitity
      //possibly add more scopes for more functionality
      }
    },//end getAccessToken method

  };//end spotify object

export default Spotify;
