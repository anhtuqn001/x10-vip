import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <button type="button" className="btn btn-light float-right" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);

const SignOutDropdownButton = withFirebase(({firebase}) => (
  <a className="dropdown-item" onClick={firebase.doSignOut}>Sign Out</a>
));

export default withFirebase(SignOutButton);
export {SignOutDropdownButton};