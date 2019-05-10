import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';

import firebaseUI from 'firebaseui';
import {withFirebase} from '../Firebase';
import firebase from 'firebase';

import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';

import styles from './firebaseProvider.css'; // This uses CSS modules.
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class FirebaseSignInPage extends Component {
    constructor(props) {
      super(props);

      this.uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: (authUser) => {
              let {displayName, email} = authUser.user;

              this.props.history.push(ROUTES.HOME);
              
              this.props.firebase.user(authUser.user.uid).set({
                displayName, email
              });
              // this.setState({ ...INITIAL_STATE });
              
            },
        },
      };

      this.state = {
          isSignedIn: undefined,
      };
    }

    componentDidMount() {
        this.unregisterAuthObserver = this.props.firebase.auth.onAuthStateChanged((user) => {
            this.setState({
                isSignedIn: !!user
            });
        });
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        return (
          <div className={styles.container}>
            <div className={styles.logo}>
              <i className={styles.logoIcon + ' material-icons'}>photo</i> My App
            </div>
            <div className={styles.caption}>This is a cool demo app</div>
            {this.state.isSignedIn !== undefined && !this.state.isSignedIn &&
              <div>
                <StyledFirebaseAuth className={styles.firebaseUi} uiConfig={this.uiConfig}
                                    firebaseAuth={this.props.firebase.auth}/>
              </div>
            }
            {this.state.isSignedIn &&
              <div className={styles.signedIn}>
                Hello {this.props.firebase.auth.currentUser.displayName}. You are now signed In!
                <a className={styles.button} onClick={() => this.props.firebase.auth.signOut()}>Sign-out</a>
              </div>
            }
          </div>
        );
      }
}

export default compose(
    withFirebase, 
    withRouter
  )(FirebaseSignInPage);