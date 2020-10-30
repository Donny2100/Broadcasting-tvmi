import * as types from '../constants/actionTypes';
import initialState from './initialState';
export default function (state = initialState, action) {
	switch (action.type) {
		case types.PROFILE:
      return {
        ...state,
        wp: action.wp,
				firebase: action.firebase
      };
		case types.USERPROFILE:
      return {
        ...state,
        profiledata: action.profiledata,
      };
		case types.SIDEMENU_CURRENT_PAGE:
      return {
        ...state,
        page: action.page
      };
		case types.TV_DATA:
			return {
				...state,
				tvdata: action.tvdata
			};
		case types.PLAYBACK_STATE:
			return {
				...state,
				track: action.track
			};
		case types.TRACK_STATE:
			return {
				...state,
				currentTrack: action.currentTrack,
				status:action.status
			};
		case types.TRACK_STATUS:
			return {
				...state,
				status:action.status
			};
			break;
		case types.PLAYBACK_STOP:
			return {
				...state,
				status: action.status
			};
		default:
			return state;
	}
}
