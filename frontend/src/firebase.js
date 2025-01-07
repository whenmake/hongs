// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDjXMGZKFD-q2j7-iaM8x0ot6mVAXyl6ps",
    authDomain: "easylogin-12a15.firebaseapp.com",
    projectId: "easylogin-12a15",
    storageBucket: "easylogin-12a15.firebasestorage.app",
    messagingSenderId: "174646514537",
    appId: "1:174646514537:web:cb152b827537c0d75ba3f8",
    measurementId: "G-DBRT5N3ZJE"
  };
  
// export const app = initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);

// Firebase 인증 객체
export const auth = getAuth(app);

