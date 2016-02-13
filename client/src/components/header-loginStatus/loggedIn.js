import React from 'react'
import { Link } from 'react-router';

import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/lib/flat-button';
import Videocam from 'material-ui/lib/svg-icons/av/videocam';

const styles = {
  title: {
    cursor: 'pointer',
  },
};

export default (props)=>{
    return (
        <AppBar
            title={<span style={styles.title}><Link to="/" className="logoLink">GIGG.TV</Link></span>}
            className="header"
            iconElementLeft={<img className="rock-it" src='../../public/img/rocket.svg' height='40' width='40' alt='' />}

            iconElementRight={
                <div>
                {props.userPrivelege === 'artist' ?
                  <RaisedButton
                    label="Create a Performance"
                    labelPosition="after"
                    backgroundColor="#fea92f"
                    icon={<Videocam />}
                    linkButton={true}
                    href="/router/describePerformance"
                  />
                :
                 ""
                }

                  <IconMenu
                  iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >

                <MenuItem
                  linkButton={true}
                  primaryText='Now Streaming'
                  containerElement={<Link to="/router/nowStreaming" className="logoLink"> Now Streaming </Link>} />

                <MenuItem
                    linkButton={true}
                    primaryText="All Artists"
                    containerElement={<Link to="/router/registeredArtists" className="logoLink">registeredArtists</Link>} />


                  <MenuItem
                    linkButton={true}
                    primaryText="Home"
                    containerElement={<Link to="/" className="logoLink">Home</Link>} />

                  {props.userPrivelege === 'artist' ?
                      <MenuItem
                      linkButton={true}
                      primaryText="Stream Yourself"
                      containerElement={<Link to="/router/describePerformance" >Stream Yourself</Link>} />
                    :
                      ""

                  }


                  <MenuItem
                    linkButton={true}
                    primaryText="About"
                    containerElement={<Link to="/router/about" className="logoLink">About</Link>} />

                  <MenuItem primaryText="Sign out" onClick={() => props.logoutAndRedirect()} />

                </IconMenu>
                </div>

              }/>
    )
}

