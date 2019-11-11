const functions =  require('firebase-functions');
const admin = require('firebase-admin');
const shortid = require('shortid');

admin.initializeApp();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.userProfile = functions.https.onRequest((req, res) => {
  
    var email = 'trieu.learn@gmail.com';
    admin.auth().getUserByEmail(email)
        .then(user=> res.json(user))
        .catch(err => res.send(string(err)));
});

const USERS = '/users';
const REFERRALS = '/referrals';
const CAMPAIGN = '/campaigns';
const CAMPAIGN_PERFORMANCE = '/campaign_perf';

function onUserCreate(user) {
    // create user profile
    
    const referral = shortid.generate();
    const {uid, email, displayName} = user;

    var database = admin.database();
    var referralRef = database.ref(`${REFERRALS}/${referral}`);
    var userRef = database.ref(`${USERS}/${uid}`)

    const customClaims = user.customClaims || {};
    customClaims.referral = referral;

    return Promise.all([
        userRef.set({referral, email, displayName}),
        referralRef.set({referral, uid, count: 0}),
        admin.auth().setCustomUserClaims(uid, customClaims)
    ]);
}

function onUserDelete(user) {
    var db = admin.database();
    var {referral} = user.customClaims;
    var ref = db.ref(`${REFERRALS}/${referral}`);
    return ref.set(null);
}

exports.onUserCreate = functions.auth.user().onCreate((user) => {
    return onUserCreate(user);
});

exports.onUserDelete = functions.auth.user().onDelete((user) => {
    return onUserDelete(user);
});