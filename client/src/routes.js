import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import VideoPlayer from './containers/video-container';
import Login from './components/login';
import {requireAuthentication} from './components/AuthenticatedComponent';
import ArtistContainer from './containers/artist-container';


export default (
    <Route path="/" component={ App } >

    <IndexRoute component={requireAuthentication(VideoPlayer)} />
      <Route path="streamYourself" component={requireAuthentication(ArtistContainer)} />

    </Route>

);
