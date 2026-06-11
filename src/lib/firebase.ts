import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwa9iUJ-YAA09CyoEu8WsNbebKsOTmSFs",
  authDomain: "ssukepizza.firebaseapp.com",
  projectId: "ssukepizza",
  storageBucket: "ssukepizza.firebasestorage.app",
  messagingSenderId: "7055046515",
  appId: "1:7055046515:web:efb7a1d02e07f3ac40f706",
  measurementId: "G-K6G90DL97Y",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);