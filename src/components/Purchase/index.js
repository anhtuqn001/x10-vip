import React, {Component} from 'react';
import {withAuthorization} from '../Session';
import { ReactComponent as GooglePayCheck } from '../../googlepaymentmark.svg';

class PurchasePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            paymentData: null,
        };
        this.changeStepTo1 = this.changeStepTo1.bind(this);
        this.changeStepTo2 = this.changeStepTo2.bind(this);
    }

    onPurchaseComplete = (paymentData)=> {
        console.log('onPurchaseComplete', paymentData);
        var $ = window.$;
        window.hidePurchasePage();
        this.setState({paymentData, step: 1});
    };

    componentDidMount() {
        window.showPurchasePage(this.onPurchaseComplete);
        this.props.authUser.getIdToken().then(idToken => {
            this.setState({idToken});
        });
    }

    componentWillUnmount() {
        window.hidePurchasePage();   
    }

    placeOrder = () => {
        let $ = window.$;
        let {paymentData, idToken} = this.state;
        console.log("AAA", idToken);
        let thiz = this;
        $.ajax({
            url: 'https://api.x10.vip/private/payment',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(paymentData),
            headers: {
              x_access_token: idToken, //If your header name has spaces or any other char not appropriate
            },
            success: function (data, textStatus, jQxhr) {
                thiz.setState({step: 2});
            },
            error: function (jqXhr, textStatus, errorThrown) {
              console.log(errorThrown);
              thiz.setState({step: 2});
            }
          });
       
    }

    changeStepTo1() {
        this.setState({ step : 1 });
        window.hidePurchasePage();   
    }

    changeStepTo2() {
        this.setState({ step : 2 });   
    }

    render() {
        var {paymentData, step} = this.state;
        return (<div>
            {/* {step === 0 && <button onClick={this.changeStepTo1} >Accept Buying</button>} */}
            {step === 1 && <OrderReview paymentData={paymentData} placeOrder={this.changeStepTo2}/>}            
            {step === 2 && <PurchaseCompleted paymentData={paymentData} />}   
                   
        </div>);
    }
}

const OrderReview = ({placeOrder, paymentData}) => (
    <div className="container" style={{maxWidth:"800px"}}>
        <div className="row justity-content-center">
            <h3>Review Order</h3>
        </div>
        <br /> 
        <table className="table order-review-table">
            <tbody>
                
                <tr>
                    <th>Pay with</th>
                    <td><GooglePayCheck style={{marginRight:"10px"}}/>{paymentData.paymentMethodData.description}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>{paymentData.email}</td>
                </tr>
                <tr>
                <th>Product Price</th>
                    <td>$126</td>
                </tr>
                <tr>
                <th>Tax</th>
                    <td>$0</td>
                </tr>
                <tr>
                <th>Total Payment Amount</th>
                <td>$126</td>
                </tr>
            </tbody>
        </table>
        <div className="row justify-content-center">
        <button className="btn btn-success" style={{width:600}} onClick={placeOrder}>Place Order</button>
        </div>
    </div>);

const PurchaseCompleted = ({paymentData}) => (
    <div className="container">
    <div className="row align-items-center flex-column">
        <span style={{fontSize: "200px", color: "Dodgerblue"}}>
            <i className="fas fa-check-circle"></i>
        </span>
        <p><b>Order Completed Successfully!!</b></p>
        <p>Your order was successfully processed using Google Pay ({paymentData.paymentMethodData.description})</p>
        <p>Check your Email for your receipt</p>
    </div>
    </div>
    );

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PurchasePage);