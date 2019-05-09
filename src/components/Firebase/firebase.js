import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

// var config = {
//     apiKey: "AIzaSyC7ly1q08efskWjGUeOwtyg0D9-Trbqhe0",
//     authDomain: "pro6-8134e.firebaseapp.com",
//     databaseURL: "https://pro6-8134e.firebaseio.com",
//     projectId: "pro6-8134e",
//     storageBucket: "",
//     messagingSenderId: "38748299877"
// };

class Firebase {
  constructor() {
    app.initializeApp(config);

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