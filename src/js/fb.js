import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import {
  firebaseConfig,
  googleScopes,
  githubScopes,
  pickerKey,
  gitPublicRepoAuth,
} from "../../secrets/fb";
let fbal = null;

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
    // return remakeAccessToken()
  });
};

/**
 * generate id token from user
 * @param {object} googleUser
 * @return {string} an id token
 */
export const getCredential = (user) => {
  console.log("getcred", user);
  return firebase.getCredential(user);
};

/**
 * get access token from user
 * can be used by back end to validate user
 * @param {object} googleUser
 * @return {string} an access token
 */
export const getAccessToken = (user) => getCredential(user).accessToken;

/**
 * call this once on app initialization
 */
export const fbuiInit = (store) => {
  // only allowing google auth because we need it for interacting with the
  // script api
  providers.google = new firebase.auth.GoogleAuthProvider();
  providers.github = new firebase.auth.GithubAuthProvider();
  googleScopes.forEach((s) => providers.google.addScope(s));
  githubScopes.forEach((s) => providers.github.addScope(s));
  // start listening for change of user
  authStateListener((user) => {
    store.dispatch("newUser", user);
  });
};

export const remakeAccessToken = async () => {
  const user = firebase.auth().currentUser;
  console.log("user", user, providers.google);
  if (!user) return null;
  //await user.unlink(providers.google.providerId)
  const rl = await user.reauthenticateWithPopup(providers.google);
  console.log("rl", rl);
  return rl;
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
      console.log(error);
    });
};

export const signinGithub = (store) => {
  store.commit("setGithubToken", gitPublicRepoAuth);
};

export const signin = (store) => {
  console.log("sigining in");
  return signer(providers.google, (result) => {
    console.log("signinresult", result);
    store.commit(
      "setGoogleToken",
      result && result.credential && result.credential.accessToken
    );
  });
};
export const signout = (store) => {
  store.commit("clearTokens", null);
  firebase.auth().signOut();
};
export const getPickerStuff = (user) => {
  console.log("pickerstuff", user);
  return {
    token: getCredential(user),
    pickerKey,
  };
};
export const getPickerKey = () => pickerKey;
