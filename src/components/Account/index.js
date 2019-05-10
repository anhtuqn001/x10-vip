import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import {withAuthorization, AuthUserContext } from '../Session';

const AccountInfo = ({authUser}) => (
    <div>
        <p>
            {authUser.email}
        </p>
        <p>
            <img width="90px" src={authUser.photoURL} />
        </p>
    </div>
);

const AccountPage = () => (
    <AuthUserContext.Consumer>
    {(authUser) => (<div className="row">
            <div className="col-md-2 col-xs-4">
                <AccountInfo authUser={authUser}/>
                
            </div>
            <div className="col-md-4 col-xs-8">
                <h4>Reset Password</h4>
                <PasswordForgetForm />
                <hr/>

                <h4 className="mt-3">Change Password</h4>
                <PasswordChangeForm />
            </div>
        </div>)}
    </AuthUserContext.Consumer>
);

const condition = authUser => {
    console.log(authUser);
    return !!authUser;
};

export default  withAuthorization(condition)(AccountPage);