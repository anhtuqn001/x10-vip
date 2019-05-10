import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const LandingPage = () => (<div>
    <p className="h1">Welcome</p>
</div>);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(LandingPage);
// export default LandingPage;

