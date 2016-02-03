import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SigninForm from '../artistAuthentication/artistSignIn'
import SignUpForm from '../artistAuthentication/artistSignUp'

const customContentStyleSignIn = {
    width: '25%',
    maxWidth: 'none'
};

const customContentStyleSignUp = {
    width: '50%',
    maxWidth: 'none'
};

const styles = {
    button: {
        width: '100%'
    }
};

export default class artistAuthenticationLanding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openSignIn: false,
            openSignUp : false
        };
    }

    handleOpen = (status) => {
        if(status === 'signin'){
            this.setState({openSignIn: true});
        }
        else{
            this.setState({openSignUp: true});
        }
    };

    handleClose = (status) => {
        if(status === 'signin'){
            this.setState({openSignIn: false});
        }
        else{
            this.setState({openSignUp: false});
        }
    };

    render() {
        const actions = [
            <FlatButton
                label="Close"
                secondary={true}
                onTouchTap={()=>this.handleClose('signin')}
            />,
        ];

        return (
            <div>
                <RaisedButton style={styles.button} label="Sign In" onTouchTap={()=>this.handleOpen('signin')} />
                <Dialog
                    title="Sign In"
                    actions={actions}
                    modal={false}
                    autoScrollBodyContent={true}
                    open={this.state.openSignIn}
                    contentStyle={customContentStyleSignIn}
                    onRequestClose={()=>this.handleClose('signin')}
                >
                    <SigninForm />
                </Dialog>
                <RaisedButton style={styles.button} label="Sign Up" onTouchTap={()=>this.handleOpen('signup')} />
                <Dialog
                    title="Sign Up"
                    actions={actions}
                    modal={false}
                    autoScrollBodyContent={true}
                    autoDetectWindowHeight={true}
                    open={this.state.openSignUp}
                    contentStyle={customContentStyleSignUp}
                    onRequestClose={()=>this.handleClose('signup')}
                >
                    <SignUpForm />

                </Dialog>
            </div>
        );
    }
}