import React, {Component, PropTypes} from 'react'
import {reduxForm} from 'redux-form'
import Paper from 'material-ui/lib/paper'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'
import DropDownMenu from 'material-ui/lib/DropDownMenu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import RadioButton from 'material-ui/lib/radio-button'
import RadioButtonGroup from 'material-ui/lib/radio-button-group'
import {SignUpArtist}  from '../../actions';
import {Link} from 'react-router'

class ArtistSignUp extends Component {

    constructor(props) {
        super(props)
    }

    onSubmit(formData) {
        this.props.SignUpArtist(formData)
    }

    render() {

        const {
            handleSubmit,
            fields: {
                user_name, password, email_id, brief_description,
                user_image, display_name, genre}
            } = this.props

        return (
            <div>
                <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <h3>Sing Up</h3>
                    <div className={`form-group ${user_name.touched && user_name.invalid ? 'has-danger' : ''}`}>
                        <label>User Name</label>
                        <input type="text" className="form-control"  {...user_name} />
                        <div className="text-help">
                            {user_name.touched ? user_name.error : ''}
                        </div>
                    </div>
                    <div className={`form-group ${password.touched && password.invalid ? 'has-danger' : ''}`}>
                        <label>Password</label>
                        <input type="password" className="form-control"  {...password} />
                        <div className="text-help">
                            {password.touched ? password.error : ''}
                        </div>
                    </div>
                    <div className={`form-group ${email_id.touched && email_id.invalid ? 'has-danger' : ''}`}>
                        <label>Email Address</label>
                        <input type="email" className="form-control"  {...email_id} />
                        <div className="text-help">
                            {email_id.touched ? email_id.error : ''}
                        </div>
                    </div>

                    <div className={`form-group ${brief_description.touched && brief_description.invalid ? 'has-danger' : ''}`}>
                        <label>A small description</label>
                        <textarea type="text" className="form-control"  {...brief_description} />
                        <div className="text-help">
                            {brief_description.touched ? brief_description.error : ''}
                        </div>
                    </div>
                    <div className={`form-group ${user_image.touched && user_image.invalid ? 'has-danger' : ''}`}>
                        <label>Your image</label>
                        <input type="text" className="form-control"  {...user_image} />
                        <div className="text-help">
                            {user_image.touched ? user_image.error : ''}
                        </div>
                    </div>
                    <div className={`form-group ${display_name.touched && display_name.invalid ? 'has-danger' : ''}`}>
                        <label>A preferrable display name</label>
                        <input type="text" className="form-control"  {...display_name} />
                        <div className="text-help">
                            {display_name.touched ? display_name.error : ''}
                        </div>
                    </div>
                    <div className={`form-group ${genre.touched && genre.invalid ? 'has-danger' : ''}`}>
                        <label>Whats your genre</label>
                        <input type="text" className="form-control"  {...genre} />
                        <div className="text-help">
                            {genre.touched ? genre.error : ''}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" >Submit</button>

                </form>
            </div>
        )
    }
}

function validate(values){
    const errors = {};

    if(!values.user_name){
        errors.user_name = 'Enter a username'
    }
    if(!values.password){
        errors.password = 'Enter a password'
    }
    if(!values.email_id){
        errors.email_id = 'Enter an email'
    }
    if(!values.brief_description){
        errors.brief_description = 'Enter a brief description'
    }
    if(!values.user_image){
        errors.user_image = 'Upload an image'
    }
    if(!values.display_name){
        errors.display_name = 'Enter a Display Name'
    }
    if(!values.genre){
        errors.genre = 'Enter a genre'
    }

    return errors
}


export default reduxForm({
    form: 'ArtistSignUp',
    fields : ['user_name', 'password', 'email_id', 'brief_description',
        'user_image', 'display_name', 'genre'],
    validate
},null,{SignUpArtist})(ArtistSignUp)