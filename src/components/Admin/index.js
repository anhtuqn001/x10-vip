import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import {Route} from 'react-router-dom';
import * as ROUTES from './routes'
import Nav from './Nav';

// import UserPage from './User/User';
// import UserDetailPage from './UserDetail';
// import ExchangePage from './Exchange';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
  
  }

  componentWillUnmount() {
  
  }

  render() {
    const {match} = this.props;
    return (
      <div className="row">
        <div className="col-md-2">
          <Nav match={match}></Nav>
        </div>
        <div className="col-md-10">
        
        </div>
      </div>
    );
  }
}

export default withFirebase(AdminPage);
