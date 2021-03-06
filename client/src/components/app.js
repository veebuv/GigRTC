import React from 'react';
import { Component,PropTypes } from 'react';
import SideBar from './sidebar';
import Header from './header';
import MyRawTheme from '../../public/css/giggTheme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';
import {determineEnvironment,refreshLoginState} from '../actions';
import {connect} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import mui from 'material-ui';
import AppBar from 'material-ui/lib/app-bar';
import jwtDecode from 'jwt-decode'

//let ThemeManager = mui.Styles.ThemeManager;
// let Colors = mui.Styles.Colors;
// let Style= mui.Styles.LightRawTheme;



injectTapEventPlugin();

export class App extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
        const{dispatch} = this.props
      if(localStorage.getItem('token')){

      dispatch(refreshLoginState({email : jwtDecode(localStorage.getItem('token')).user_name}))
      }
  }

  getChildContext() {
    return {
      stores: this.props.stores,
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme)
    };
  }

  render() {
    return (
      <div className="appComponentBody">
        <Header/>
        <SideBar/>
        <div className="videoWrapper">
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  stores: React.PropTypes.object,
  muiTheme: React.PropTypes.object
};

function mapStateToProps(state){
    return {
        environment : state.environment,
        tokenState : state.auth
    }
}

export default connect(mapStateToProps)(App)
