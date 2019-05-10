import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// const config = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDeK0FB3gTMyHcW-mIrummgP7bwIocFZ40",
  authDomain: "x10.vip",
  databaseURL: "https://x10-vip.firebaseio.com",
  projectId: "x10-vip",
  storageBucket: "x10-vip.appspot.com",
  messagingSenderId: "36843300315",
  appId: "1:36843300315:web:3a4444a2f60a9f4d"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  /*** Room API */
  capchas = (uid) => this.db.ref(`capchas/${uid}`);

  capcha = (roomId, uid) => 
    this.db.ref(`capchas/${roomId}/${uid}`);

  rooms = () => this.db.ref('rooms');

  getRoom = (uid) => this.db.ref(`rooms/${uid}`);

  doCreateRoom = (roomId, roomName) => 
    this.getRoom(roomId).set({active: true, roomName});

  doRemoveRoom = (roomId) => 
    this.getRoom(roomId).set({active: false});

  doEnterRoom = (roomId, userId) => 
    this.getRoom(roomId).ref("users").update({[userId]: true});

  doLeaveRoom = (roomId, userId) => 
    this.getRoom(roomId).ref("users").update({[userId]: null});

  // *** User API ***
  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');  
}

export default Firebase;