import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';

import firebaseUI from 'firebaseui';
import {withFirebase} from '../Firebase';
import firebase from 'firebase';

import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';

import styles from './firebaseProvider.css'; // This uses CSS modules.
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import qs from 'querystring';

class FirebaseSignInPage extends Component {
    constructor(props) {
      super(props);
      var query = this.props.location.search || '';
      var values =  qs.parse(query.replace('?', ''));
     
      this.uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: [
              // 'https://www.googleapis.com/auth/contacts.readonly'
            ],
            customParameters: {
              // Forces account selection even when one account
              // is available.
              prompt: 'select_account'
            }
          },
            // firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: (authUser) => {
              // let {displayName, email} = authUser.user;

              if(values && values.returnUrl)
                this.props.history.push(values.returnUrl);
              else 
                this.props.history.push(ROUTES.SCREENER);
              
              // this.props.firebase.user(authUser.user.uid).set({
              //   displayName, email
              // });
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
            if(!!user) this.props.history.push(ROUTES.SCREENER);
            console.error(MediaDeviceInfo.deviceId); 
        });
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        return (
          <React.Fragment>
               <div className={styles.container}>
              <div className={styles.logo}>
                <i className={styles.logoIcon + ' material-icons'}>
                  <a href="/intro.html"><img src="/favicon.ico" /></a>
                </i>
              </div>
                {/* <div className={styles.caption}>Login</div> */}
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
           
          </React.Fragment>
         
          );
      }
}

export default compose(
    withFirebase, 
    withRouter
  )(FirebaseSignInPage);