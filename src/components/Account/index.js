import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import {withAuthorization, AuthUserContext } from '../Session';

const AccountPage = () => (
    <AuthUserContext.Consumer>
    {(authUser) => ( <div className="row">
            <div className="col-md-4">
                <h1>Account: {authUser.email}</h1>
                <PasswordForgetForm />
                <PasswordChangeForm />
            </div>
        </div>)}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default  withAuthorization(condition)(AccountPage);