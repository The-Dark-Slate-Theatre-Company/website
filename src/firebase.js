import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCp11b2gwB39Q-Z_eSG_VdpLsPxTElTMow",
  authDomain: "dark-slate-2.firebaseapp.com",
  projectId: "dark-slate-2",
  storageBucket: "dark-slate-2.firebasestorage.app",
  messagingSenderId: "592965812019",
  appId: "1:592965812019:web:f4c2924b65dc5c97a44846",
  measurementId: "G-415FPMBXMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export {
  app,
  db,
  storage,
  auth
}