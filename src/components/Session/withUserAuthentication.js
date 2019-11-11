import React from 'react';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import LoadingScreen from '../Loading';
import withAuthorization from './withAuthorization';
import {Link} from 'react-router-dom';

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
      var code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
          code = '0' + code;
      }
      return '%' + code;
  }));
}

const subscriptionCondition = claims => !!claims && claims.subscription > new Date().getTime(); 

const withSubscription = Component => Unsubscription => {
    class WithSubscription extends React.Component {
        constructor(props) {
            super(props);
            // console.log(this.props);
        }

        render() {
            return (
                <React.Fragment>
                    {this.props.authorization && (<Component {...this.props} />)}
                    {!this.props.authorization && (<Unsubscription idToken={this.props.idToken} claims={this.props.claims} />)}
                </React.Fragment>
            );
        }
    }
    return withUserAuthrorization(subscriptionCondition)(WithSubscription);
}

const withUserAuthrorization = condition => Component => {
  class WithUserAuthrorization extends React.Component {
      constructor(props) {
          super(props);
          this.state = {loading: true, authorization: false, claims: null, idToken: null};
      }

      componentDidMount() {
          this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
              if(authUser) {
                  authUser.getIdToken().then(idToken => {
                      const claims = JSON.parse(b64DecodeUnicode(idToken.split('.')[1]));
                      var authorization = condition(claims);
                      this.setState({claims, idToken, authorization});
                  }).finally(()=> this.setState({loading: false}));
              }
          });
      }


      componentWillUnmount() {
          this.listener();
      }

      render() {
      
          return (<React.Fragment>
              {this.state.loading && <LoadingScreen />}
              {!this.state.loading
                   && <Component {...this.props}  idToken={this.state.idToken} 
                   authorization={this.state.authorization}
                   claims={this.state.claims} /> }
             
          </React.Fragment>);
      }
  }
  return compose(
      withAuthorization(authUser => !!authUser),
    )(WithUserAuthrorization);
}

export default withUserAuthrorization;

export {b64DecodeUnicode, withSubscription};
