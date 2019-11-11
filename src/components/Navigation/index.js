import React from 'react';
import {  NavLink  } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import SignOutButton, {SignOutDropdownButton} from '../SignOut';
import { AuthUserContext } from '../Session';

const Navigation = ({ authUser }) => (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  );

const NavigationAuth = ({authUser}) => (
    <nav className="navbar  navbar-expand-lg navbar-light bg-light">
      <a href="/intro.html" style={{'marginRight': '1rem'}}>
        <img style={{height: '30px'}} src="/assets/img/favicon.png" />
      </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" 
          data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav  mr-auto">
          <ul className="navbar-nav">
            {/* <li className="nav-item">
              <a className="nav-item nav-link" href="/intro.html">Home</a>
            </li> */}
            <li className="nav-item">
              <NavLink className="nav-item nav-link" to={ROUTES.SCREENER}
                activeClassName="collapse" >Screener</NavLink>
            </li>
           
          </ul>
        </div>
        <ul className="navbar-nav navbar-right">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {authUser.displayName}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <NavLink className="dropdown-item" to={ROUTES.ACCOUNT} >Profile</NavLink>
              <SignOutDropdownButton />
            </div>
          </li>
        </ul>
      </div>
    </nav>
   
);

const NavigationNonAuth = () => (
    <React.Fragment></React.Fragment>
  );

export default Navigation;