const Realm = require('realm');

class User {};
User.schema = {
  name: 'User',
  properties: {
    //id: {type: 'int'},
    wp: {type: 'string'},
    firebase: {type: 'string'},
  }
};
class UserProfile {};
UserProfile.schema = {
  name: 'UserProfile',
  properties: {
    profiledata: {type: 'string'},
  }
};

class MediaPlayer {};
MediaPlayer.schema = {
  name: 'MediaPlayer',
  properties: {
    data: {type: 'bool'},
    track:{type: 'int'}
  }
};
class NotificationCheck {};
NotificationCheck.schema = {
  name: 'NotificationCheck',
  properties: {
    data: {type: 'bool'},
  }
};
/*
class devToken {};
User.schema = {
  name: 'devToken',
  properties: {
    devToken: {type: 'string'},
  }
};
*/
class Card {};
Card.schema = {
  name: 'Card',
  properties: {
    id: {type: 'int'},
    card: {type: 'string'}
  }
};

class Balance {};
Balance.schema = {
  name: 'Balance',
  properties: {
    id: {type: 'int'},
    balance: {type: 'string'}
  }
};

class NewsFeed {};
NewsFeed.schema = {
  name: 'NewsFeed',
  properties: {
    id: {type: 'int'},
    date: {type: 'date', default: new Date(), optional: true},
    category: {type: 'string', optional: true},
    url: {type: 'string', optional: true},
    cache_html: {type: 'string', optional: true},
    height: {type: 'int', optional: true},
    type: {type: 'string', optional: true},
    title: {type: 'string', optional: true},
    subtitle: {type: 'string', optional: true},
    image: {type: 'string', optional: true},
    has_video:  {type: 'int', optional: true},
    has_gallery:  {type: 'int', optional: true},
    related_label: {type: 'string', optional: true},
    share_url: {type: 'string', optional: true},
    share_label: {type: 'string', optional: true},
    is_related: {type: 'bool', default: false},
    related_news_feeds: {type: 'NewsFeed[]', default: []}
  }
};

let realm = new Realm({schema: [User, UserProfile, Balance, Card, MediaPlayer, NotificationCheck, NewsFeed], deleteRealmIfMigrationNeeded: true});

exports.WriteData = function(key , data){
  realm.write(() => {
    realm.create(key, data);
  });
}

exports.UpdateData = function(key,data){
  realm.write(() => {
    realm.create(key, data, true);
  });
}

exports.UpdateArray = function(key,data){
  for(var i=0;i<data.length;i++){
    realm.write(() => {
      realm.create(key, data[i], true);
    });
  }
}

exports.ReadData = function(key){
  return realm.objects(key);
}

exports.ReadDataWithFilters = function(key,filter){
  var allData = realm.objects(key).filtered(filter);
  return allData;
}

exports.DeleteData = function(key){
  realm.write(() => {
    let allData = realm.objects(key);
    realm.delete(allData);
  });

}

exports.DeleteDataWithFilters = function(key,filter){
  realm.write(() => {
    let allData = realm.objects(key).filtered(filter);
    //console.log("DeleteDataWithFilters: " + allData.length);
    realm.delete(allData);
  });
}

exports.DeleteDataWithFilters = function(key,filter,arg){
  realm.write(() => {
    let allData = realm.objects(key).filtered(filter, arg);
    //console.log("DeleteDataWithFilters: " + allData.length);
    realm.delete(allData);
  });
}