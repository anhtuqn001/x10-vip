import React, {Component} from 'react';

const Loading = ({loading}) => (loading && <div className="text-center">Loading ...</div>);
const withList = (Comp) => props => (<ul className="list-group"><Comp {...props}/></ul>)
const withListItem = (Comp) => props => (<li className="list-group-item"><Comp {...props}/></li>)

export {Loading, withList, withListItem};