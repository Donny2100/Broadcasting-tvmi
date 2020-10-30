import { Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import Realm from './realm';

import { playbackState, TrackState, TrackStatus } from './reducers/app.actions';

async function eventHandler(store, data) {
//  const previousData  = Realm.ReadData('MediaPlayer');
    switch(data.type) {

        // Forward remote events to the player
        case 'remote-play':
            TrackPlayer.play();
            store.dispatch(TrackStatus(true));
            /*
            Realm.WriteData('MediaPlayer',{
              data:!previousData[previousData.length-1].data,
              track:previousData[previousData.length-1].track
            });
            */
            break;
        case 'remote-pause':
            TrackPlayer.pause();
            store.dispatch(TrackStatus(false));
            /*
            Realm.WriteData('MediaPlayer',{
              data:!previousData[previousData.length-1].data,
              track:previousData[previousData.length-1].track
            });
            */
            break;
        case 'remote-stop':
            TrackPlayer.stop();
            store.dispatch(TrackState(0,false));
            //Realm.DeleteData('MediaPlayer');
            break;
        case 'playback-error':
            Alert.alert('An error ocurred', data.error);
            break;
        case 'playback-state':
            console.log(data);
            /*
            const playerState = TrackPlayer.getState();
            const promise1 = Promise.resolve(playerState);
            promise1.then(function(value) {
              console.log("Promise array", value);
            });
            */
            store.dispatch(playbackState(data.state));
            break;
    }
};

module.exports = function(store) {
    return eventHandler.bind(null, store);
};
