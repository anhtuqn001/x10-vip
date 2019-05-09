import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';

//https://code.visualstudio.com/docs/editor/emmet
const PasswordForgetPage = (props) =>  (<div className="m-3">
    
    <h1>Password Forget</h1>
    <PasswordForgetForm></PasswordForgetForm>
</div>);

const INITIAL_STATE = {
    email: '',
    error: null,
};


class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event) => {
        const {email} = this.state;
        
        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({...INITIAL_STATE});
            }).catch(error => {
                this.setState({error});
            });

        event.preventDefault();
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const {email, error} = this.state;
        return (<form  onSubmit={this.onSubmit} >
            <div className="form-group">
            
                <input name="email" onChange={this.onChange} 
                className="form-control"
                placeholder="Email"/>
                
            </div>
            <div className="form-group">
                <button type="submit" 
                className="btn btn-primary">Submit</button>
            </div>
            
            {error && <p>{error}</p>}
        </form>);
    }
}

const PasswordForgetLink = () => {
    return (
        <p>
          <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
        </p>
      );
};
  

  export default PasswordForgetPage;

  const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
  
  export { PasswordForgetForm, PasswordForgetLink };