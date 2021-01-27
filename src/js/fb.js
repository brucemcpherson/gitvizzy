import firebase from "firebase/app";
import "firebase/analytics";
import { firebaseConfig } from '../../secrets/fb'
let fbal = null;
export const initFb = () => { 
  firebase.initializeApp(firebaseConfig);
  fbal = firebase.analytics();
}
export const logEvent = (name, pack) => { 
  return fbal.logEvent (name, pack)
}
