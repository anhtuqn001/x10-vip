import React, {Component} from 'react';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';


class CapchaPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            capchas: [],
        };
    }

    componentDidMount() {
        this.setState({
            loading: true
        });

        let roomId = this.props.match.params.id;
      
        this.props.firebase.capchas(roomId).on('value', snapshot => {
            const capchaObject = snapshot.val() || {};
            console.log(capchaObject);
            var capchas = Object.keys(capchaObject).map(key => ({
                uid: key, 
                ...capchaObject[key]}));

            this.setState({
                capchas,
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.capchas().off();
    }

    render() {
        let roomId = this.props.match.params.id;
        return (
          <div>
            <h1 className="App">Room {roomId}</h1>
            {this.state.loading && <div className="App">Loading ...</div>}
            <CapchaList roomId={roomId} capchas={this.state.capchas}></CapchaList>
            <p className="text-muted">Hãy điền mã capch vào các ô bên cạnh. Khi đủ 4 kí tự, 
                phần mềm tự động gửi lời giải cho bot, và dịch chuyển sang ô cần giải kế tiếp.
                Nếu có nhiều người cùng giải, thì ai xong trước sẽ được gửi lời giải trước.
            </p>
          </div>
        );
      }
}

class CapchaListBase extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(component, text) {
        if(text && text.length === 4) {
            const capcha = component.props.capcha;
            var keys = Object.keys(this.refs);
            let index = keys.findIndex(i => i === capcha.uid);
            if(index >= 0) {
                let i = (index + 1) % keys.length;
                do 
                {
                    let next = this.refs[keys[i]];
                    let text = next.state.text;
                    if(text.length !== 4) {
                        next.focusTextInput();
                        break;
                    }
                    i = (i+1)%keys.length;
                    console.log(i, next.state);
                    
                } while(i !== index);
            }
        }
    }

    render() {
        let {capchas} = this.props;
        return (<ul className="list-group">
        {
            capchas.map(capcha => (
                    <CapchaListItem roomId={this.props.roomId} capcha={capcha} key={capcha.uid} ref={capcha.uid} 
                    firebase={this.props.firebase}
                    onChange={this.onChange}/>
                ))
        }
        </ul>);
    }
}

const CapchaList = withFirebase(CapchaListBase);

class CapchaListItem extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            text: props.capcha.solution || '',
            submitting: false,
        };
        this.onTextChanged = this.onTextChanged.bind(this);
        this.textInput = React.createRef();
        this.focusTextInput = this.focusTextInput.bind(this);
        this.updateCapha = this.updateCapha.bind(this);
    }

    focusTextInput() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput.current.focus();
      }
      
    onTextChanged(input) {
        let text = input.target.value;
        this.setState({text});
        if(this.props.onChange) {
            this.props.onChange(this, text);
        }
        if(text && text.length === 4) {
            this.updateCapha(this.props.capcha.uid, text);
        }
    }

    updateCapha(uid, solution) {
        this.setState({submitting: true})
        this.props.firebase.capcha(this.props.roomId, uid).update({solution})
            .then(()=> this.setState({submitting: false}))
            .catch(err => {
                console.error(err);
            });
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.capcha.solution != nextProps.capcha.solution){
            this.setState({ text: nextProps.capcha.solution || ''});
        }
        
    }

    // static getDerivedStateFromProps(nextProps, prevState){
    //     if(nextProps.capcha!==prevState.capcha){
    //       return { text: ''};
    //    }
    //    else return null;
    //  }

    

    render() {
        let {capcha} = this.props;
        let text = this.state.text || '';
       
        return (<li className="list-group-item" >
            <img src={capcha.img.src} className="ml-3" alt=".."/>
            <input ref={this.textInput} className="ml-3" onChange={this.onTextChanged} value={text}></input>
            <span className="ml-3">{capcha.uid}</span>
            {this.state.submitting && "Gửi kết quả..."}
            {this.state.error && <span className="text-danger">{this.state.error}</span>}
        </li>);
    }
}


const condition = authUser => !!authUser;

export default withAuthorization(condition)(CapchaPage);