import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import { auth } from 'firebase';

const Navigation = ({ authUser }) => (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  );

const NavigationAuth = ({authUser}) => (
    <ul className="nav">
        <li className="nav-item"><Link className="nav-link " to={ROUTES.HOME}>Trang chủ</Link></li>
        {/* <li className="nav-item"><Link className="nav-link " to={ROUTES.SCREEN}>Screener</Link></li> */}
        <li className="nav-item"><Link className="nav-link " to={ROUTES.ACCOUNT}>Tài khoản</Link></li>
        {/* <li className="nav-item"><Link className="nav-link " to={ROUTES.ADMIN}>Admin</Link></li> */}
        <SignOutButton />
  </ul>
);

const NavigationNonAuth = () => (
    <React.Fragment></React.Fragment>
  );

export default Navigation;