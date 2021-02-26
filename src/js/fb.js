import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import {
  firebaseConfig,
  googleScopes,
  githubScopes,
  pickerKey
} from "../../secrets/fb";
let fbal = null;
import ky from "ky";

// firebase auth not implemented
// eventually this can be used to create and update apps script projects,
// but I can't be bothered going through the verification process for now
// since it'll need access to a restricted scope
export const initFb = () => {
  firebase.initializeApp(firebaseConfig);
  fbal = firebase.analytics();
};

export const logEvent = (name, pack) => {
  return fbal.logEvent(name, pack);
};

// keep a note of providers here
let providers = {
  google: null,
};

/**
 * listens for authstate changes and registers them in the store
 */
const authStateListener = (onUser) => {
  firebase.auth().onAuthStateChanged((user) => {
    return onUser(user);
  });
};

/**
 * call this once on app initialization
 */
export const fbuiInit = (dispatch) => {
  // only allowing google auth because we need it for interacting with the
  // script api
  providers.google = new firebase.auth.GoogleAuthProvider();
  providers.github = new firebase.auth.GithubAuthProvider();
  googleScopes.forEach((s) => providers.google.addScope(s));
  githubScopes.forEach((s) => providers.github.addScope(s));
  // start listening for change of user
  authStateListener((user) => {
    dispatch("newUser", user);
  });
};

const signer = (provider, onSigned) => {
  console.log("sigining in ", provider);
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log("signed in with popup", result);
      return onSigned(result);
    })

    .catch((error) => {
      console.log("this error", error);

      if (error.code === "auth/account-exists-with-different-credential") {
        // that's fine because all we want is the credential
        console.log("linked in with popup", error);
        return onSigned(error);
      }
      console.log(error);
      Promise.reject(error);
    });
};

export const signinGithub = (commit, dispatch) => {
  return signer(providers.github, (result) => {
    commit(
      "setGithubToken",
      result && result.credential && result.credential.accessToken
    );
    dispatch("setStoredTokens");
  });
};

export const checkGoogleToken = (token) => {
  return ky
    .get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`)
    .json()
    .catch(() => {
      return null;
    });
};

export const isGoogleTokenValid = (token) => {
  if (!token) return Promise.resolve(false);
  return checkGoogleToken(token).then((r) => {
    console.log(r);
    return r && !r.error && r.expires_in > 60;
  });
};

export const signin = (commit, dispatch) => {
  return signer(providers.google, (result) => {
    commit(
      "setGoogleToken",
      result && result.credential && result.credential.accessToken
    );
    dispatch("setStoredTokens");
  });
};

export const signout = (commit) => {
  commit("clearTokens", null);
  firebase.auth().signOut();
};



export const getPickerKey = () => pickerKey;
