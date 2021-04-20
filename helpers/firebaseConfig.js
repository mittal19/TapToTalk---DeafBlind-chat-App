import * as firebase from 'firebase';

const firebaseConfig = 
{
  apiKey: "AIzaSyCRwGrxtIwiURawt8bTjJqwNffdAlPu4Qc",
  authDomain: "taptotalk-ce0f0.firebaseapp.com",
  databaseURL: "https://taptotalk-ce0f0-default-rtdb.firebaseio.com",
  projectId: "taptotalk-ce0f0",
  storageBucket: "taptotalk-ce0f0.appspot.com",
  messagingSenderId: "694469466212",
  appId: "1:694469466212:web:4cb755c88bc985f2582771",
  measurementId: "G-PJQCVBSK4F"
};    //make web app in firebase project and copy details here

if(!firebase.apps.length)
  firebase.initializeApp(firebaseConfig);   //prevent app from intializing again n again

exports.firebase = firebase;
