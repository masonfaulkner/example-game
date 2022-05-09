import firebase from "./firebase";
import "firebase/app";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCui2OHYpjtvueb1ffSIUa19CuwcbSVs2o",
  authDomain: "empire-1b08c.firebaseapp.com",
  databaseURL: "https://empire-1b08c.firebaseio.com",
  projectId: "empire-1b08c",
  storageBucket: "empire-1b08c.appspot.com",
  messagingSenderId: "37826276936",
  appId: "1:37826276936:web:7d490b6b075688e4fe327d",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
