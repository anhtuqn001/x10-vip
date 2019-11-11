import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import * as ROUTES from './routes';

const Nav = ({match}) => (<ul className="nav flex-sm-column">
    <li className="nav-item">
        <NavLink to={`${match.url}/${ROUTES.USER_BASE}`} 
        className="nav-link" activeClassName="font-weight-bold">Users</NavLink>
    </li>
    <li className="nav-item">
        <NavLink to={`${match.url}/${ROUTES.EXCHANGES}`} 
        className="nav-link" activeClassName="font-weight-bold" >Exchanges</NavLink>
    </li>
</ul>);

export default Nav;