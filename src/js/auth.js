/* global gapi */
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import {
  firebaseConfig,
  googleScopes,
  githubScopes,
  googleConfig,
} from "../../secrets/config";
let fbal = null;

// firebase auth inly used for github
// using gapi for google auth so token gets refreshed automatically
export const initFb = () => {
  firebase.initializeApp(firebaseConfig);
  fbal = firebase.analytics();
};

// log fb analytica event
export const logEvent = (name, pack) => {
  return fbal.logEvent(name, pack);
};

// keep a note of providers here
let providers = {
  github: null,
};

/**
 * call this once on app initialization
 */
export const fbuiInit = () => {
  providers.github = new firebase.auth.GithubAuthProvider();
  githubScopes.forEach((s) => providers.github.addScope(s));
};

const signer = (provider, onSigned) => {
  // actually this is general purpose, but we're oly using it for github
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      return onSigned(result);
    })

    .catch((error) => {
      if (error.code === "auth/account-exists-with-different-credential") {
        // that's fine because all we want is the credential

        return onSigned(error);
      }
      console.log(error);
      Promise.reject(error);
    });
};

// we need to sign into github to get an oauth token to avoid quota problems which are legion
export const signinGithub = (commit, dispatch) => {
  return signer(providers.github, (result) => {
    // github tokens dont expire, so this will presist until specific logout
    commit(
      "setGithubToken",
      result && result.credential && result.credential.accessToken
    );
    // store this for future sessions
    dispatch("setStoredTokens");
  });
};

// sign in to google using gapi
export const signin = () => {
  return gapi.auth2.getAuthInstance().signIn();
};

// signout of both google and github
export const signout = (commit) => {
  // signout of google
  const ai = gapi.auth2.getAuthInstance();
  ai.signOut();
  // signout of firebase (github)
  firebase.auth().signOut();
  // thses will need refreshed
  commit("clearTokens", null);
};

// these will be needed when creating a picker instance for container bound scripts
export const getPickerKey = () => googleConfig.apiKey;
export const getProjectId = () => googleConfig.projectId;

// called on startup to get gapi going
export const gapiInit = (onUser) => {
  return gapi.client.init(googleConfig).then(function() {
    // Listen for sign-in state changes.
    const instance = gapi.auth2.getAuthInstance();
    instance.currentUser.listen(onUser);

    // Handle the initial sign-in state.
    onUser(instance.currentUser.get());
  });
};

export const gapiCheckScopes = (user) => {
  if (!user)
    return {
      ok: false,
      granted: null,
    };
  // these are the scopes we've been granted
  const granted = (user.getGrantedScopes() || "").split(" ");
  const ok = googleScopes.every((f) => granted.indexOf(f) !== -1);
  const denied = googleScopes.filter((f) => granted.indexOf(f) === -1);
  return {
    ok,
    granted,
    requested: googleScopes,
    denied,
  };
};

export const gapiAdditionalScopes = (user) => { 
  if (!user) return Promise.resolve(null);

  // get currently assigned scopes
  const checkScopes = gapiCheckScopes(user)

  // if we have all we need it's done
  if (checkScopes.ok) return Promise.resolve(checkScopes)

  // now we have to get the previously denied scopes
  const option = new gapi.auth2.SigninOptionsBuilder();
  option.setScope(checkScopes.denied.join(" "));
  return user.grant(option)
    .then(() => { 
      return gapiCheckScopes(user)
    })
}
