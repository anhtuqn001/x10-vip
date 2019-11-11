import React, {Component} from 'react'
import {withFirebase} from '../../Firebase';
import * as Common from '../../Common';
import * as ROUTES from '../../../constants/routes';

const Campaign = Common.withListItem(({campaign}) => (<div>
    <a href="" className="pull-left w-40 m-r">
        <img src={campaign.imageUrl} className="img-responsive img-circle" />
    </a>
    <div className="clear">
        <Link className="nav-link font-bold block" to={`${ROUTES.USER_BASE}/${campaign.uid}`}>
            {campaign.displayName}
        </Link>
        {campaign.description}
    </div>
</div>));

const CampaignsBase = ({campaigns}) => {
    const views = campaigns.map(cp => <Campaign key={cp.id} campaign={cp}/>);
    return <React.Fragment>{views}</React.Fragment>   
};

const Campaigns = Common.withList(CampaignsBase);

class ExchangeListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {campaigns: [], loading: false};
    }

    componentDidMount() {
        this.setState({loading: true});
        this.props.firebase.campaigns().on('value', (snapshot) => {
            let obj = snapshot.val() || {};
            let campaigns = Object.keys(obj).map(key => ({uid: key, ...obj[key]}));
            this.setState({campaigns, loading: false});
        });
    }

    componentWillUnmount() {
        this.props.firebase.campaigns().off();
    }

    render() {
        return (<div>
            <Campaigns campaigns={this.state.campaigns} />
        </div>);
    }
}

export default withFirebase(ExchangeListPage);