
import { withUserAuthentication } from '../Session';
import React, {Component} from 'react';
import {UserApi} from '../Api'
import Loading from '../Loading';
import Subscription from './Subscription';
import {Link} from 'react-router-dom';
import *as ROUTES from '../../constants/routes';
import PurchasePage from '../Purchase';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const INITIAL_REFERRAL_MODAL_STATE = {email: '', error: null, isSuccessful: false}

const Unsubscription = ({claims}) => (<div>
    <h5 className="text-danger">Your subscription is expired or you haven't buy a subcription.</h5>
    <div>
        <Link to={ROUTES.ACCOUNT}>Check my account</Link>
      
    </div>
</div>);

const User = ({user, claims}) => {
    return (<React.Fragment>
        <div className="r-t pos-rlt" style={{background:'url(/images/a0.jpg)', center: 'center', 'backgroundSize':'cover'}}>
                    <div className="p-lg bg-white-overlay text-center r-t">
                        <a href="" className="w-xs inline">
                            <img src={user.photoURL} className="img-circle img-responsive" />
                        </a>
                        <div className="m-b m-t-sm h4">
                            <span className="">{user.displayName}</span>
                        </div>
                    </div>
                </div>
                <div className="list-group no-radius no-border">
                   <a className="list-group-item d-flex flex-sm-column flex-lg-row">
                        <div className="p-1">Email</div> <div className="ml-auto p-1">{user.email}</div>
                    </a>
                    <a className="list-group-item d-flex flex-sm-column flex-lg-row">
                    <div className="">Last Login</div> <div className="ml-auto p-1">{user.metadata.lastSignInTime}</div>
                    </a>
                    <a className="list-group-item d-flex flex-sm-column flex-lg-row" >
                    <div className="">Referral ID</div><div className="ml-auto p-1">{claims.referral}</div> 
                    </a>
                    <a className="list-group-item d-flex flex-sm-column flex-lg-row" >
                    <div className="">Subscription</div><div className="ml-auto p-1">
                            {claims.subscription && new Date(claims.subscription).toLocaleDateString()}
                            {!claims.subscription && "None"}
                        </div>
                    </a>
                </div>
                
                
    </React.Fragment>)
};

const X10Wallet = ({profile, customClaims}) => {
    profile = profile || {};
    var { accounts, transactions} = profile;
    accounts = accounts || {};
 
    var {x10} = accounts;
    var data = transactions || {};
    var trans = Object.keys(data).map(k => data[k]).filter(t => t.currency === 'x10');

    var histories = trans.sort((a, b) =>  b.openAt - a.openAt).map(t => <tr key={t.id}>
            <td>{new Date(t.openAt).toLocaleString()}</td>
            <td>{t.type}</td>
            <td>{t.amount || 0}</td>
            <td>{t.status === 1000 ? 'closed': 'open'}</td>
        </tr>);
    return (<div className="panel mt-3">
                <div className="panel-heading text-center">
                    <h3>
                        Points: {x10 || 0}
                        {/* <Link className="btn btn-success btn-sm ml-3" to={ROUTES.PURCHASE}>
                            <i className="google-pay-button"></i>
                        </Link> */}
                        <Link to={ROUTES.PURCHASE}>
                        <button className="google-pay-button"></button> 
                        </Link>
                    </h3>
                    <hr/>
                </div>
                <div className="panel-body">
                    {(trans.length > 0) && (<div>
                        <table className="table table-striped table-sm">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {histories}
                            </tbody>
                        </table>
                    </div>)}
                </div>
        </div>);
};

const Referral = ({ onInviteButtonClick }) => (<div className="text-center b-b b-light">
    <a href="" className="inline m text-color">
        <span className="h3 block font-bold">0</span>
        <em className="text-xs">Referrals</em>
    </a>
    <a href="" className="inline m text-color">
        <span className="h3 block font-bold">0</span>
        <em className="text-xs">Rewards</em>
    </a>
    <button className="btn btn-info btn-block" onClick={onInviteButtonClick}>Invite Friends</button>
</div>)


class ReferralModal extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_REFERRAL_MODAL_STATE;
        this.handleChange = this.handleChange.bind(this);
        this.handleInviteClick = this.handleInviteClick.bind(this);
        this.isEmailValid = this.isEmailValid.bind(this);
        this.onHideReferralModal = this.onHideReferralModal.bind(this);
    }

    handleChange(e) {
        this.setState({ email : e.target.value });
    }

    isEmailValid(email) {
        var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegEx.test(email);
    }

    handleInviteClick() {
        var { email } = this.state;
        if (!this.isEmailValid(email)) {
            var error = {messages : ["Please enter a valid email"]};
            this.setState({isSuccessful : false, error });
            console.log("unvalid");
        } else {
            this.setState({...INITIAL_REFERRAL_MODAL_STATE, isSuccessful : true});
        }
    }

    onHideReferralModal() {
        var { hideReferralModal } = this.props;
        hideReferralModal();
        this.setState(INITIAL_REFERRAL_MODAL_STATE);
    }

    render() {
        var { isShow } = this.props;
        var { email, error, isSuccessful } = this.state;
        var errorView;
        if (error) {
            errorView = <ul>{error.messages.map((msg, index) => <li className="text-danger" key={index}>{msg}</li>)}</ul>
        }
        var successMessage = "An invitation email has been sent to your friend's email, please check inbox"; 
        return(
            <Modal show={isShow} onHide={this.onHideReferralModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Invitation
                </Modal.Title>
            </Modal.Header> 
            <Modal.Body>
                    <div className="input-group mb-3">
                        <input type="Email" className="form-control" onChange={this.handleChange} value={email} placeholder="Enter your friend's email" />
                        <div className="input-group-append">
                            <button className="btn btn-success" type="button" onClick={this.handleInviteClick}>Invite</button>
                        </div>
                    </div>
                    {isSuccessful && <div className="text-success">{successMessage}</div>}
                    <div>{errorView}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.onHideReferralModal}>Cancel</Button>
            </Modal.Footer>
            </Modal>
        )
    }
}

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: false, profile: null, isReferralModalShow: false}
        this.userApi = new UserApi(this.props.idToken);
        this.showReferralModal = this.showReferralModal.bind(this);
        this.hideReferralModal = this.hideReferralModal.bind(this);
    }

    fetchUser = () => {
        this.setState({loading: true});
        this.userApi.getProfile().then(res => {
            var profile = res.data.profile;
            this.setState({profile});
        }).finally(() => this.setState({loading: false}));
    }

    componentDidMount() {
        this.fetchUser();  
    }

    showReferralModal() {
        this.setState({
            isReferralModalShow : true
        });
    }
    
    hideReferralModal() {
        this.setState({
            isReferralModalShow : false
        });
    }

    componentWillUnmount() {}

    render() {
        const { profile, loading, isReferralModalShow } = this.state;
        return (<div>
           {loading && <Loading loading={loading}/>}
           {!loading && (
           <div className="row row-sm ng-scope justify-content-center">
               <div className="col-lg-4 col-md-6 order-1">
                   <div className="panel panel-card">
                        <User user={this.props.authUser} 
                            profile={this.state.profile}
                            claims={this.props.claims} />
                        <Referral onInviteButtonClick={this.showReferralModal}/>
                   </div>
                </div>
                <div className="col-lg-8 col-md-6 order-2">
                    <X10Wallet {...this.state.profile} />
                   <div>
                        <Subscription claims={this.props.claims} idToken={this.props.idToken}/>
                   </div>

                    <hr></hr>
                  
                </div>
           </div>)}
            <ReferralModal isShow={isReferralModalShow} hideReferralModal={this.hideReferralModal} />
        </div>);
    }
}

const condition = claims => !!claims;

export default  withUserAuthentication(condition)(AccountPage, Unsubscription);

export {Subscription};