import React, {Component} from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import Login from './login';
import {connect} from 'react-redux';
import {logoutAndRedirect,fetchProtectedData} from '../actions';



import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';


export class Header extends Component {

    constructor(props) {
      super(props);
      this.state = {open: false};
    }


    handleToggle = () => this.setState({open: !this.state.open});

    render() {
        return (

          <div>
            <AppBar
              title="GIGG.TV"
              containerElement={<Link to="/" className="logoLink">Gigg</Link>}
              iconElementLeft={<IconButton><NavigationClose /></IconButton>}
              iconElementRight={
                <IconMenu
                  iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem
                    linkButton={true}
                    primaryText="Home"
                    containerElement={<Link to="/" className="logoLink">GIGG.tv</Link>} />
                  <MenuItem
                    linkButton={true}
                    primaryText="Broadcast"
                    containerElement={<Link to="/streamYourself" >Stream Yourself</Link>} />
                  <MenuItem><a href='#' className='jsonLinkText' onClick={() => this.props.fetchProtectedData(this.props.token,this.props.environment)}>FOR JSON</a></MenuItem>
                  <MenuItem primaryText="Sign in" />
                  <MenuItem primaryText="Sign out" />
                </IconMenu>
              }/>
              <div>
              {this.props.isAuthenticated
                ? <li className="loginForm"><a href='#' onClick={() => this.props.logoutAndRedirect()}>Logout</a> </li>
                : <Login />
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
        environment : state.environment
    }
}

export default connect(mapStateToProps,{logoutAndRedirect,fetchProtectedData})(Header)
