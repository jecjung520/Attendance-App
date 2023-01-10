import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCgps1SF0ipokWDI5unS1DSdsYIWI3Qjqg",
    authDomain: "attendance-app-99c42.firebaseapp.com",
    projectId: "attendance-app-99c42",
    storageBucket: "attendance-app-99c42.appspot.com",
    messagingSenderId: "485253299053",
    appId: "1:485253299053:web:990acfe835da16708a3864",
    measurementId: "G-8YL48XW4S8"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export { firebase };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase