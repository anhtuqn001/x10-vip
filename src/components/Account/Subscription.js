
import React, {Component} from 'react';
import {UserApi} from '../Api';
import Loading from '../Loading';
import {Modal, Button} from 'react-bootstrap';
import { withAuthorization } from '../Session';

const Product = ({product, idToken, profile, firebase}) => {

  var _profile = profile || {};
  var {subscriptions} = _profile;
  subscriptions = subscriptions || {};
  var subscription = subscriptions[product.sku];
  var actionView;
  
  if(subscription) {

    var today = new Date().getTime();
   
    if(today <= subscription)
    {
      actionView = (<div className="alert alert-success">Your subscription is active!</div>);
    }
    else if(product.trial)
    {
      actionView = (<div className="alert alert-warning">Your trial subscription is expired!</div>);
    }
    else 
    {
      actionView = (<Purchase firebase={firebase} product={product} idToken={idToken} renew />);
    }
  }
  else 
  {
    actionView = (<Purchase firebase={firebase} product={product} idToken={idToken} />);
  }

  return (<div className="card m-2" style={{width: '18rem'}} >
    <div className="card-body">
        <h4>{product.name}</h4>
        <div className="card-text">
            {product.description}
            <ul>
                {product.features.map((f,i) => <li key={i}>{f}</li>)}
            </ul>
        </div>
      
    </div>
    <div className="card-footer text-muted" >
      {actionView}
    </div>
</div>);
};


class Purchase extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.startSubscription = this.startSubscription.bind(this);
  
      this.state = {
        show: false,
        loading: false,
        profile: null
      };

      this.api = new UserApi(this.props.idToken);
    }
  
    handleClose() {
      this.setState({ show: false });
    }

    startSubscription = () => {
      var {product, authUser} = this.props;
      this.setState({loading: true});

      this.api.addSubcription(product.sku).then((result) => {
        authUser.getIdToken(true).then(idToken => {
          window.location.reload();
        });
          
      }).finally(()=>this.setState({loading: false}));
      this.setState({ show: false });
    }

    handleShow() {
      this.setState({ show: true });
      this.setState({loading: true});
      this.api.getProfile().then(res => {
        this.setState({profile: res.data.profile});
        console.log(res.data);
      }).finally(() => this.setState({loading: false}));
    }

    purchaseConfirm = () => {
      var {product} = this.props;
      var {profile} = this.state;
      profile = profile || {};
      // console.log('AAAAAAAAAAAA', profile);

      var {accounts} = profile;
      accounts = accounts || {};
      var x10 = accounts.x10 || 0;
      var price = product.price;
     
      var isValidBalance = (x10 >= price);
      var isValid = isValidBalance;

      return (<div>
        {!isValidBalance && <p className="text-danger">You have not enough point. This subscrition requires {price} points.</p>} 
        {isValid && (<p>Start the subscription {product.name}?</p>)}
      </div>);
    }

    render() {
      var {product} = this.props;
      var {profile} = this.state;
      var {accounts} = (profile || {});
      accounts = accounts || {};
      var x10 = accounts.x10 || 0;
      var price = product.price;
      var isValidBalance = (x10 >= price);
      var isValid = isValidBalance;
      return (
        <>
            <div className="text-center">
            <Button variant="primary" onClick={this.handleShow}>
            {product.trial ? "Start Trial" : (this.props.renew ? "Renew" : "Start Subscription") }
          </Button>
            </div>
         
          <Modal show={this.state.show} onHide={this.handleClose}>
            {!this.state.loading && (<Modal.Header closeButton>
              <Modal.Title>Summary</Modal.Title>
            </Modal.Header>)}
            
            <Modal.Body>
              {this.state.loading && <Loading />}
              {!this.state.loading && this.purchaseConfirm()}
              
            </Modal.Body>
            {!this.state.loading && isValid && (<Modal.Footer>

              <Button variant="secondary" onClick={this.handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={this.startSubscription}>
                Confirm
              </Button>
            </Modal.Footer>)}
          </Modal>
        </>
      );
    }
  }
  
class Subscription extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            profile: null,
        };
        this.api = new UserApi(this.props.idToken);
    }

    componentDidMount() {
        this.api.fetchProducts().then(res => {
            var products = res.data;
            this.setState({products});
        });

        this.api.getProfile().then(res => {
            this.setState({profile: res.data});
        });
    }

    componentWillUnmount() {

    }

    render() {
      
        var {products} = this.state;
        // var {claims} = this.props;
        // console.log(claims);
        var productViews = products.map(product => {

          var profile = this.state.profile || {};
          profile = profile.profile;

          return (<Product
            firebase={this.props.firebase}
            profile={profile}
            product={product}
            idToken={this.props.idToken}
            key={product.sku} />);
        });

        return (<div className="panel">
            <div className="panel-heading m-3 text-center">
                {/* <h3>Products</h3> */}
            </div>
            <div className="panel-body">
                <div className="row justify-content-center">
                    {productViews}
                </div>
            </div>
    </div>)
    }
}

var condition = user => !!user;
export default withAuthorization(condition)(Subscription);