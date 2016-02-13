import React, {Component} from 'react';
import { Navbar } from 'react-bootstrap';
import { Link , Router} from 'react-router';
import Login from './forms/login';
import {connect} from 'react-redux';
import {logoutAndRedirect,fetchProtectedData} from '../actions';


import FBLoginBtn from './loginButtons/FBButton'
import SignInModal from './modals/userSigninModal'

import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';


import NotLoggedInHeader from './header-loginStatus/notLoggedIn'
import LoggedInHeader from './header-loginStatus/loggedIn'

export class Header extends Component {

    constructor(props) {
      super(props);
      this.state = {open: false};
    }

    render() {
        var userName;

//To check if user is G+ or FB customer as details returned are different
        (function userDetails(){
            if(this.props.userDetails && this.props.userDetails.isPlusUser){
                    userName = {name : this.props.userDetails.displayName}
            }
            else{
                userName = this.props.userDetails
            }

        }.bind(this))()

        return (

          <div>

              <div>
              {this.props.isAuthenticated
                ? <LoggedInHeader user_details={this.props.userDetails}
                                  logoutAndRedirect={this.props.logoutAndRedirect.bind(this)}
                                  userPrivelege={this.props.userPrivelege}
                  />
                : <NotLoggedInHeader/>
              }
              </div>
          </div>
        );
    }
}

function mapStateToProps(state){
    return{
        isAuthenticated: state.auth.isAuthenticated,
        token: state.auth.token,
        environment : state.environment,
        userDetails : state.auth.userDetails,
        userPrivelege: state.auth.userPrivelege
    }
}

export default connect(mapStateToProps,{logoutAndRedirect,fetchProtectedData})(Header)
