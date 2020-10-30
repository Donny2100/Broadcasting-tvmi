import * as types from '../constants/actionTypes';

export function setProfile(wp , firebase) {
  return {
    type: types.PROFILE,
    wp:wp,
    firebase:firebase
  }
}

export function Profile(wp , firebase) {
  return (dispatch) => {
    dispatch(setProfile(wp , firebase))
  }
}

export function setUserProfile(profiledata) {
  return {
    type: types.USERPROFILE,
    profiledata:profiledata,
  }
}

export function UserProfile(profiledata) {
  return (dispatch) => {
    dispatch(setUserProfile(profiledata))
  }
}

export function setCurrentPage(currentpage) {
  return {
    type: types.SIDEMENU_CURRENT_PAGE,
    page:currentpage
  }
}

export function CurrentPage(currentpage) {
  return (dispatch) => {
    dispatch(setCurrentPage(currentpage))
  }
}

export function setTvData(tvdata) {
  return {
    type: types.TV_DATA,
    tvdata:tvdata
  }
}

export function TvData(tvdata) {
  return (dispatch) => {
    dispatch(setTvData(tvdata))
  }
}
///////
export function setplaybackState(track) {
  return {
    type: types.PLAYBACK_STATE,
    track:track
  }
}

export function playbackState(track) {
//  console.log(status);
  return (dispatch) => {
    dispatch(setplaybackState(track))
  }
}

////////////////////////////////////////////
export function setTrackState(currentTrack, status) {
  return {
    type: types.TRACK_STATE,
    currentTrack:currentTrack,
    status:status
  }
}

export function TrackState(currentTrack, status) {
//  console.log(status);
  return (dispatch) => {
    dispatch(setTrackState(currentTrack, status))
  }
}


////////////////////////////////////////////
export function setTrackStatus(status) {
  return {
    type: types.TRACK_STATUS,
    status:status
  }
}

export function TrackStatus(status) {
//  console.log(status);
  return (dispatch) => {
    dispatch(setTrackStatus(status))
  }
}
