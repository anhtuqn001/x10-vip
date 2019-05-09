import React, {Component} from 'react';
import {withFirebase} from '../Firebase';
import {Link} from 'react-router-dom'

class RoomListBase extends Component {
    constructor(props) {
        super(props);
        this.state = {rooms: [], loading: false}
    }

    componentDidMount() {
        this.setState({loading: true})
        this.props.firebase.rooms().on('value', (snapshot)=> {
            let roomObject = snapshot.val() || {};
            let rooms = Object.keys(roomObject).map(key => ({uid: key, ...roomObject[key]}))
            console.log(roomObject, rooms);
            
            this.setState({rooms, loading: false});
        });
    }

    componentWillMount() {
        this.props.firebase.rooms().off();
    }

    render() {

        return (
        <div  >
             {this.state.loading && <div className="App">Đang tải ...</div>}
            <ul className="list-group list-group-flush"> 
                {this.state.rooms.map(room => (
                    <Room key={room.uid} room={room}></Room>
                ))}
            </ul>
            {/* <RoomForm firebase={this.props.firebase} /> */}
          </div>);
    }
}

const INITIAL_STATE = {
    roomId: '',
    name: ''
}

class RoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE}
    }

    onSubmit = (e) => {
        const { roomId, name } = this.state;

        this.props.firebase
          .doCreateRoom(roomId, name)
          .then(() => {
            this.setState({ ...INITIAL_STATE });
          })
          .catch(error => {
            this.setState({ error });
          });
    
        e.preventDefault();
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const {error, roomId, name} = this.state;
        const isInvalid = roomId === '' 
            || name === '';

        return (<form onSubmit={this.onSubmit}>
         <div className="form-group row m-3">
            <div className="col-sm-6">
            <input
                    className="form-control"
                    name="roomId"
                    value={roomId}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Room ID" />
            </div>
           <div className="col-sm-6">
           <input
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Tên Room"/>
           </div>
         </div>
           

        <button disabled={isInvalid} type="submit" 
            className="btn btn-default ml-3">Thêm</button>
          
            
    
            {error && <p>{error.message}</p>}
          </form>);
    }
}

class Room extends Component {

    render() {
        const {room} = this.props;
        const bot = room.bot || 0;
        const man = room.man || 0;
        const bots = Object.keys(room.bots || {});
        const listBot = bots.map((val, index) => {
            var clazz = room.bots[val] ? "text-info m-3" :  "m-3 text-danger";
            return (<span className={clazz} key={index}>{val}</span>);
        });
        return (<li className="list-group-item">
            <Link to={`Capcha/${room.uid}`}>{room.name}</Link>
             {listBot}
        </li>);
    }
}

const RoomList = withFirebase(RoomListBase);

export default RoomList;