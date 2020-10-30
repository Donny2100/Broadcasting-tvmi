import React from 'react';
import {Alert,NetInfo} from "react-native";
import { BASE_URL} from './constants';
var connectionInfoData = "";

_handleConnectionInfoChange = (connectionInfo) => {
  connectionInfoData = connectionInfo;
};

NetInfo.addEventListener(
    'change',
    this._handleConnectionInfoChange
);

NetInfo.fetch().done((connectionInfo) => {
    connectionInfoData = connectionInfo;
  }
);

exports.TimeMethod = function(REQUESTTYPE, URL , _CallBack , token , data){
  //alert(connectionInfoData);
  if(connectionInfoData === null || connectionInfoData === 'none' || connectionInfoData === 'NONE' || connectionInfoData === 'unknown'){
    _CallBack(false , "Please check your network connection and try again");
    return;
  }
  console.log(BASE_URL);
  console.log(URL);
  console.log(data);
  var request = new XMLHttpRequest();
  request.timeout = 30000;
  request.onload = (e) => {
    //console.log(JSON.stringify(request));
    if(isJson(request.responseText)){
      console.log('network_request', request);
      var responseData = JSON.parse(request.responseText.toString());
      if(responseData === undefined){
        _CallBack(false , "Please check your network connection and try again");
        return;
      }
      if(responseData.hasOwnProperty("errors")){
        _CallBack(false , JSON.stringify(responseData.errors));
        return;
      }else{
        _CallBack(true , responseData);
        return;
      }
    }else{
      _CallBack(false, "Invalid response from server");
      return;
    }
  };

  request.ontimeout = (e) => {
    _CallBack(false , "Please check your network connection request has timed out");
    return;
  };

  request.onerror = (e) => {
    //alert(request.responseText);
    _CallBack(false, request.responseText);
    return;
  };

  request.open(REQUESTTYPE, BASE_URL+URL,true);
  if(token){
    request.setRequestHeader('Authorization', token);
  }else{
    request.setRequestHeader('Authorization', "Basic tvm-mobile-outsource:OTJRVHdXVnhPaGVGRlUyRnNkR1ZrWDE4NUsxQWVMNE9DdVdBMXJUcEZIV3BITVBMTDhSZW5rZm1rbTZ3dzJkajRSeFlWTFE1NmIyeA==");
  }
  if(data){
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //request.setRequestHeader("Content-length", data.length.toString());
    //request.setRequestHeader("Connection", "close");
    request.send(data);
  }else{
      request.send();
  }
}

exports.FormMethod = function(REQUESTTYPE, URL, _CallBack , token , data, isFullUrl){
  var request = new XMLHttpRequest();
  request.timeout = 60000;
  request.onload = (e) => {
    //alert(request.responseText);
    if(isJson(request.responseText)){
      var responseData = JSON.parse(request.responseText.toString());
      if(responseData === undefined){
        _CallBack(false , "Please check your network connection and try again");
        return;
      }
      if(responseData.hasOwnProperty("errors")){
        _CallBack(false , JSON.stringify(responseData.errors));
        return;
      }else{
        _CallBack(true , responseData);
        return;
      }
    }else{
      _CallBack(false, "Invalid response from server");
      return;
    }
  };

  request.ontimeout = (e) => {
    _CallBack(false , "Please check your network connection request has timed out");
    return;
  };

  request.onerror = (e) => {
    alert(request.responseText);
    _CallBack(false, "Invalid response from server");
    return;
  };

  request.open(REQUESTTYPE, isFullUrl ? URL : (BASE_URL+URL));
  if (token) {
    request.setRequestHeader('Authorization', token);
  }
  //request.setRequestHeader("Content-Type", "application/octet-stream");
  request.send(data);
}

exports.CommonMethod=function(URL , REQUESTTYPE , _CallBack , token, data){
  /*if(connectionInfoData === null || connectionInfoData === 'none' || connectionInfoData === 'unknown'){
    _CallBack(false , "Please check your network connection and try again");
    return;
  }*/
  const config = {
    method: REQUESTTYPE,
    headers: {
      'Authorization': token
    },
    body: data
  }

  fetch(BASE_URL+URL, config)
  .then((response) => {
    alert(JSON.stringify(response));
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
      response.status);
      //_CallBack(false, 'Looks like there was a problem. Status Code: ' + response.status);
      return;
    }else if(response.ok){
      if(isJson(response)){
          return response.json();
      }else{
        _CallBack(false, "Invalid response from server");
        return;
      }
    }else{
      _CallBack(false , "Please check your network connection and try again");
      return;
    }
  }).then((responseData) => {
    alert(JSON.stringify(responseData));
    if(responseData === undefined){
      _CallBack(false , "Please check your network connection and try again");
      return;
    }
    //console.log(JSON.stringify(responseData));
    if(responseData.hasOwnProperty("errors")){
      _CallBack(false , responseData.errors);
      return;
    }else{
      _CallBack(true , responseData);
      return;
    }
  })
  .catch((error) => {
    //_CallBack(false , "Please check your network connection and try again");
    return;
  }).done();
}

function isJson(item){
    if(item === ""){
      return false;
    }
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;
    try {
      if(item.length == 0){
        return false;
      }
      item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}
