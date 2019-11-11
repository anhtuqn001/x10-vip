 // TODO: Replace the following with your app's Firebase project configuration
     var firebaseConfig = {
        apiKey: "AIzaSyDeK0FB3gTMyHcW-mIrummgP7bwIocFZ40",
        authDomain: "x10.vip",
        databaseURL: "https://x10-vip.firebaseio.com",
        projectId: "x10-vip",
        storageBucket: "x10-vip.appspot.com",
        messagingSenderId: "36843300315",
        appId: "1:36843300315:web:3a4444a2f60a9f4d"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(function(user) {
        console.log(user);
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            $(".app-auth").removeClass('collapse');
            $("#username").html(displayName);
            // ...
        } else {
            // User is signed out.
            // ...
            $(".app-unauth").removeClass('collapse');
        }
    });