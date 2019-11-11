import React, {Component} from 'react';
import {withSubscription} from '../Session';
import {Unsubscription} from '../Screen';    
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class StartTrial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: true
        };
        this.goToSceener = this.goToSceener.bind(this)
    }

    goToSceener() {
        this.props.history.push('/screener');
    }
    
    render() {
        var { isShow } = this.state;
        return (
        <Modal show={isShow} >
          <Modal.Header closeButton>
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have already started Trial</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.goToSceener} >
              Go to the Screener 
            </Button>
          </Modal.Footer>
        </Modal>
        );
    }
}

export default withSubscription(StartTrial)(Unsubscription)