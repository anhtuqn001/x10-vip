import React, { Component } from 'react';


import * as ROUTES from '../../constants/routes';
import { withFirebase, FirebaseContext } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const SignUpPage = () => (
  <div className="m-3">
    <h1>Đăng kí</h1>
    <FirebaseContext.Consumer>
      {firebase => <SignUpForm firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
  };

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser)=> {
         return this.props.firebase.user(authUser.user.uid).set({
           username, 
           email
         });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  render() {
    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error,
      } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
        <form onSubmit={this.onSubmit}>
        <div className="form-group">
        <input
          name="username"  value={username} onChange={this.onChange} type="text" 
          className="form-control"
          placeholder="Full Name"
        />
        </div>
        <div className="form-group">
        <input
          name="email" value={email}
          onChange={this.onChange}
          type="text" className="form-control" placeholder="Email Address"
        />
        </div>
        <div className="form-group">
        <input
          name="passwordOne"
          className="form-control"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        </div>
        <div className="form-group">
        <input
          name="passwordTwo" value={passwordTwo} className="form-control"
          onChange={this.onChange} type="password" placeholder="Confirm Password"
        /></div>
        <div className="form-group">
          <button disabled={isInvalid}  type="submit">Sign Up</button>
        </div>
       
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Chưa có tài khoản? <Link to={ROUTES.SIGN_UP}>Đăng kí</Link>
  </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase,
  )(SignUpFormBase);
  

export default SignUpPage;

export { SignUpForm, SignUpLink };