import firebase from "firebase";

const firebaseConfig = {
   apiKey: "AIzaSyD1T6hEnVS5P9QA09iNGh6TTqnYiHYmNYM",
   authDomain: "wassup-9d922.firebaseapp.com",
   projectId: "wassup-9d922",
   storageBucket: "wassup-9d922.appspot.com",
   messagingSenderId: "63370869165",
   appId: "1:63370869165:web:77bd035f2681c58348c924",
};


const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };