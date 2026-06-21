import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";


export async function GetUserData(uid=null) {

  let userUid = uid;
  if(userUid === null) userUid = auth.currentUser.uid;

  const docRef = doc(db, 'users', userUid);
  const snap = await getDoc(docRef);
  const data = snap.data();
  return data;

}


export async function SetUserData(uid=null, data) {

  let userUid = uid;
  if(userUid === null) userUid = auth.currentUser.uid;

  try {
    const docRef = doc(db, 'users', userUid);
    const snap = await setDoc(docRef, data, {merge: true});
  }
  catch(err) {
    console.error(err);
  }

}


export async function GetPublicUserData(uid=null) {
  
  let userUid = uid;
  if(userUid === null) {
    const privateUser = await GetUserData();
    userUid = privateUser.public_uid;
  }

  const docRef = doc(db, 'users-public', userUid);
  const snap = await getDoc(docRef);
  const data = snap.data();
  return data;

}


export async function SetPublicUserData(uid=null, data) {

  let userUid = uid;
  if(userUid === null) {
    const privateUser = await GetUserData();
    userUid = privateUser.public_uid;
  }

  try {
    const docRef = doc(db, 'users-public', userUid);
    const snap = await setDoc(docRef, data, {merge: true});
  }
  catch(err) {
    console.error(err);
  }

}