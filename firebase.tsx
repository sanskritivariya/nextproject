import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBL8ATePyi8i-1GLKv5xjUPJy2LnFcPH6Y",
  authDomain: "demoproject-c13d6.firebaseapp.com",
  projectId: "demoproject-c13d6",
  storageBucket: "demoproject-c13d6.firebasestorage.app",
  messagingSenderId: "355551396978",
  appId: "1:355551396978:web:8aa4df63dc125d74276eeb",
  measurementId: "G-YNC2KT585G"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);