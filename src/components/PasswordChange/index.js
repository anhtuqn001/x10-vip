import React, { Component } from 'react';
import {withFirebase} from '../Firebase';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null
};

const PasswordChangePage = () => (<PasswordChangeForm />);

class PasswordChangeFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event) => {
        event.preventDefault();
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const {passwordOne, passwordTwo, error} = this.state;
        const isInvalid = (passwordOne !== passwordTwo 
            || passwordOne === '');

        return (<form>            
            <div className="form-group">
                <label className="label-control" htmlFor="passwordOne">Password</label>
                <input className="form-control" type="password" name="passwordOne" />
            </div>
            <div className="form-group">
                <label className="label-control" htmlFor="passwordTwo">Retype Password</label>
                <input className="form-control" type="password" name="passwordTwo" />
            </div>
            <div className="form-group">
                <button disabled={isInvalid} className="btn btn-primary">Change Password</button>
            </div>
        </form>);
    }
}

const PasswordChangeForm = withFirebase(PasswordChangeFormBase);

const PasswordChangeLink = () => (<p>
    <Link to={ROUTES.PASSWORD_CHANGE}></Link>
</p>);

export default PasswordChangePage;

export {PasswordChangeForm, PasswordChangeLink};