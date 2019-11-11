import React, {Component} from 'react';
import {withFirebase} from '../Firebase';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class LandingPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
            if(authUser) {
                this.props.history.push(ROUTES.SCREENER);
            } else {
                window.location = ROUTES.INTRO;
            }
        });
      }
  
    componentWillUnmount() {
        this.listener();
    }

    render() {
        let styles = {"background": 'white'};
        return (<div className="login-container text-center" style={styles}>
            <div className="spinner-border text-primary" role="status">
            </div>
            <p className="text-info">Please wait...</p>
        </div>);
    }
}

export default  withFirebase(LandingPage);


