import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { withFirebase } from './components/Firebase';
import Capcha from './components/Capcha'

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/Session';
import Navigation from './components/Navigation';
import HomePage from './components/Home';
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';
import PasswordForgetPage from './components/PasswordForget'
import PasswordChangePage from './components/PasswordChange'
import AccountPage from './components/Account'
import LandingPage from './components/Landing'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      },
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <Router>
          <div>
            <Navigation authUser={this.state.authUser} />

            <hr />
      
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.PASSWORD_CHANGE} component={PasswordChangePage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.CAPCHA} component={Capcha} />
          </div>
        </Router>);
  }
}

export default withAuthentication(App);
