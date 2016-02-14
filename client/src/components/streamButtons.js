import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';

const style = {
    display: 'block',
    margin: '0px auto 15px',
    backgroundColor: '#fc3535',
    fontSize: '1.4em',
    padding: '10px',
    color: '#fff'
};

const StreamButtons = (props) => {
  return (
    <div className="streamButtons">
      {(props.currentPrivelege && !props.watchMode) ? <button onClick={props.startBroadcast} className="startBroadcast fa fa-youtube-play">Start Stream</button> : ""}
      {props.watchMode ? <FlatButton onTouchTap={props.watchVideo}
                                     label="Restart"
                                     style = {style}

      /> : ""}
      {props.watchMode ? <FlatButton onTouchTap={props.endBroadcast}
                                     label ="Stop Stream"
                                     style={style}
      /> : ""}

        {(props.currentPrivelege && !props.watchMode) ?  <button onClick={props.endBroadcast}className="endBroadcast fa fa-stop-circle">Stop Stream!</button>  : ""}

    </div>
    )
};

export default StreamButtons;
