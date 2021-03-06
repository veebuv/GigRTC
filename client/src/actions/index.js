import { checkHttpStatus, parseJSON } from '../utils';
import CONSTANTS from '../constants/index';
import axios from 'axios';
const {
    LOGIN_USER_REQUEST,
    LOGIN_USER_FAILURE,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER,
    FETCH_PROTECTED_DATA_REQUEST,
    RECEIVE_PROTECTED_DATA,
    SAVE_BROADCAST,
    CURRENT_ENVIRONMENT,
    PUBLIC_TOKEN,
    FETCH_ACTIVE_STREAMS,
    LOGIN_ARTIST_SUCCESS,
    VIEW_COUNT_UPDATE,
    ARTIST_STREAMING_STATUS,
    FETCH_ALL_STREAMS,
    FILTER_REGISTERED_ARTISTS,
    FETCH_REGISTERED_ARTISTS,
    UPLOAD_IMAGE,
    PERFORMANCE_DETAIL_UPDATE,
    PERFORMANCE_DETAIL_SUCCESS,
    PERFORMANCE_DETAIL_FAILURE,
    SUBSCRIPTION_STATUS,
    SUBSCRIBED_USERS,
    ADD_TAG,
    SUBSCRIBED_TO_ARTIST
    } = CONSTANTS;

import jwtDecode from 'jwt-decode';
import {browserHistory,hashHistory} from 'react-router';
import io from 'socket.io-client';



export function loginUserSuccess(userObj){
    localStorage.setItem('token',userObj.token);
    return{
        type : LOGIN_USER_SUCCESS,
        payload : userObj
    }
}
export function loginArtistSuccess(userObj){
    localStorage.setItem('token',userObj.token);

    return{
        type : LOGIN_ARTIST_SUCCESS,
        payload : userObj
    }
}


export function refreshLoginState(loggedInEmail){
    var data = axios.get('/auth/getTokenizedUserDetails',{params : loggedInEmail})

    return {
        type : PUBLIC_TOKEN,
        payload : data
    }
}

export function loginUserFailure(error) {
    localStorage.removeItem('token');
    return {
        type: LOGIN_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    }
}

export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST
    }
}

export function logout() {
    localStorage.removeItem('token');
    return {
        type: LOGOUT_USER
    }
}

export function logoutAndRedirect() {
    return (dispatch, state) => {
        dispatch(logout());
        browserHistory.push('/');
    }
}

export function environmentLocation(data) {

        return {
            type : CURRENT_ENVIRONMENT,
            payload : data
        }
}


export function loginArtist(creds){
    let config = {
        method: 'post',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    }

    return (dispatch) =>{
        //return fetch(location.host + '/auth/getToken/', config) -> initial approach
        dispatch(loginUserRequest());
        return fetch(`/auth/signIn/`, config)
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {

                try {
                    let decoded = jwtDecode(response.token);
                    dispatch(loginArtistSuccess({token : response.token, artist_details:response.artist_details}));
                    browserHistory.push('/')
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            })
    }

}

export function SignUpArtist(creds){
    let config = {
        method: 'post',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    }

    return (dispatch) =>{
        dispatch(loginUserRequest());
        return fetch(`/auth/signUp/`, config)
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {

                try {
                    let decoded = jwtDecode(response.token);
                    dispatch(loginArtistSuccess({token : response.token, artist_details:response.artist_details}));
                    browserHistory.push('/')
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            })
    }

}

export function perfDetailUpdate() {
  return {
    type : PERFORMANCE_DETAIL_UPDATE
  }
}

export function perfDetailSuccess(perfObj) {
  return {
    type : PERFORMANCE_DETAIL_SUCCESS,
    payload : perfObj
  }
}

export function perfDetailFailure(errObj) {
  return {
    type: PERFORMANCE_DETAIL_FAILURE,
    payload : {
      error: errObj
    }
  }
}

export function MakePerformance(formData){
    let config = {
        method: 'put',
        credentials: 'include', // someday security can look at token
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }

    return (dispatch) =>{
        dispatch(perfDetailUpdate());
        return fetch(`/api/describe/`, config)
            .then(checkHttpStatus) // this throws us into the catch if the response code isn't positive (200 etc)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(perfDetailSuccess(response));
                    browserHistory.push('/router/streamYourself');
                } catch (e) {
                    dispatch(perfDetailFailure(response));
                }
            })
            .catch(error => {
                dispatch(perfDetailFailure(error));
            })
    }
}

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data: data
        }
    }
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROTECTED_DATA_REQUEST
    }
}

export function fetchProtectedData(token,environment) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        return fetch(`${environment}/getData/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.data));

            })
            .catch(error => {
                if(error.response.status === 401) {
                    dispatch(loginUserFailure(error));
                    browserHistory.push('/');
                }
            })
    }
}

//establish Environment
export function determineEnvironment(){
    let config = {
        method: 'post',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    return (dispatch,state) => {
       return fetch('/auth/getToken/', config)
            .then(response=> {
                dispatch(environmentLocation('https://localhost:1338'))
            }).catch((error)=> {
            dispatch(environmentLocation('https://tranquil-dusk-46949.herokuapp.com'))

        })
    }
}


 export function getSocialDetails(){


    return (dispatch) =>{
        return  fetch(`/auth/validateSocialToken`)
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    //let decoded = jwtDecode(response.token);
                    dispatch(loginUserSuccess({token : response.token, user_details:response.user_details}));
                    browserHistory.push('/')
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid token'
                        }
                    }));
                }
            })
            .catch(error => {

                dispatch(loginUserFailure(error));
            })
    }
}

export function getActivePerformances(){

    return (dispatch) => {
        return axios.get('/api/activeStreams')
        .then(function (response){
            dispatch({
                type : FETCH_ACTIVE_STREAMS,
                payload : response
            })
        })
    }
}

export function getAllStreams(){

    var data = axios.get('/api/allStreams')

    return {
        type : FETCH_ALL_STREAMS,
        payload : data
    }

}




//placeholder for post to /api/saveBroadcast endpoint
export function saveBroadcast(broadcastData) {
  axios.post('api/saveBroadcast', broadcastData);

  return {
    type: SAVE_BROADCAST,
    payload: broadcastData
  }
}

//CHANGE THIS TO POINT TO THE SERVER END POINT AND THIS FUNCTION IS BEING CALLED PREFIXED WITH activeStreams as i'm trying to start a stream, which should be prevented for users as they will only have watch buttons
export function performanceActive(room){
    const data = axios.put('/api/activeStreams', room);

    return {
        type : ARTIST_STREAMING_STATUS,
        payload : data
    }
}



export function updatePerformanceViewCount(room){

         axios.put('/api/updatePerformanceViewCount', room)
        .then(function (response) {
            dispatch(showTotalViewersWatching(response.data.views))
        }).catch((error)=> {
            console.log("AXIOS ERROR", error);
        })


}

export function showTotalViewersWatching(room){
    var data = axios.get('/api/currentViewers', room);

    return {
        type : VIEW_COUNT_UPDATE,
        payload : data
    }

}

export function fetchAllRegisteredArtists(){
    var data = axios.get('/api/allRegisteredArtists')

    return {
        type : FETCH_REGISTERED_ARTISTS,
        payload : data
    }
}

export function subscribeToArtist(info) {
    var data = axios.post('/api/subscribeToArtist', {
        user_id: info.user_id,
        artist_id: info.artist_id

    })

    return {
        type : SUBSCRIBED_TO_ARTIST,
        payload : data
    }

}

//This Action may not be necessary based on twilio implementation // TODO
export function emailAllSubscribers(artistDetails){
    var data = axios.get('/api/emailAllSubscribers',{params : artistDetails})

    return {
        type : SUBSCRIBED_USERS,
        payload : data
    }
}

export function addTag(tag) {

    return (dispatch) => {
        return axios.post('/api/addTag', tag)
        .then(response => {
             dispatch(showTag(response.data));
        }).catch(error=> {
            console.log("add tag error", error);
        })

    }
}

export function showTag(data){
    return {
        type : ADD_TAG,
        payload : data
    }

}



