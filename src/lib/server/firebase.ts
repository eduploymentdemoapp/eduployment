import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, query, orderByChild, equalTo, update, remove } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyCppQVWfJPU23NuiBbRnn1QHfZwogBOT-o',
  authDomain: 'eduployment-ad249.firebaseapp.com',
  databaseURL: 'https://eduployment-ad249-default-rtdb.firebaseio.com',
  projectId: 'eduployment-ad249',
  storageBucket: 'eduployment-ad249.firebasestorage.app',
  messagingSenderId: '940867101479',
  appId: '1:940867101479:web:2fde0a3e11c2cd846aff02',
  measurementId: 'G-S5K53SQKF0'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getDatabase(app);

export { app, auth, db, createUserWithEmailAndPassword, sendEmailVerification, set, ref, get, query, orderByChild, equalTo, update, remove};

