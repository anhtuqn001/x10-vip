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

    var client = this;
   
    this.auth.onAuthStateChanged(function (user) {
      if(user && !client.tokenRef) {
        client.tokenRef = client.db.ref('users/' + user.uid + '/sessionId');
        
        client.tokenRef.on('value', function(snapshot) {
          var serverToken = snapshot.val() + '';
          
          var sessionId = window.getCookie('sessionId');
          // console.log('serverToken', serverToken, 'sessionId', sessionId);
          if(serverToken && sessionId !== serverToken) {
            client.doSignOut();
          }
        });
      }
    })
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

  signIn = provider =>  this.auth.signInWithPopup(provider);
  // *** User API ***

  // *** Campaign API **
  products = () => this.db.ref('/campaigns');

  product = (id) => this.db.ref(`/campaigns/${id}`);
}

export default Firebase;