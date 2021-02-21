// this used to be on redis, but we need it client side now
// so the is a just a gist compressed
const { decompress } = require("./compress");
const { queryDefinition } = require("./settings");
const { Octokit } = require("@octokit/rest");
const delay = require('delay');

import kyc from "ky";

const ky = kyc;
export const getky = (url) => ky.get(url).json();
let octokit = null;

export const cacheInit = (store) => {
  octokit = new Octokit({
    auth: store.githubToken,
    userAgent: "scrviz v1.0.1",
  });
};

const getRateInfo = (response) => {
  const { headers } = response;

  const ratelimitRemaining = headers["x-ratelimit-remaining"];
  const ratelimitReset = headers["x-ratelimit-reset"];
  return {
    ratelimitRemaining,
    ratelimitReset,
    waitTime:
      ratelimitRemaining > 1
        ? 0
        : Math.max(2500, ratelimitReset * 1000 - new Date().getTime()),
  };
};
const getWithWait = (what, tries = 0) => {
  return what().catch((qe) => {
    const { error } = qe;
    const { status } = error;
    // we get a 403 for rate limit exceeded (why not 429?)
    if ((status !== 403 && status !== 429) || tries > 3)
      return Promise.reject(qe);
    const { waitTime } = getRateInfo(error);
    console.log("....waiting", waitTime);
    // try again
    return delay(waitTime).then(() => getWithWait(what, tries + 1));
  });
};

export const decorator = (url) => {

  const u = url.replace('https://api.github.com', 'GET ')
  return getWithWait(() =>
    octokit.request(u).then((r) => {
      return r.data;
    })
  );
};


// this should get us the latest raw url for this gist
const raw = () => {
  return getky(queryDefinition.gistApi).then((r) => {
    return r.files && r.files[Object.keys(r.files)[0]].raw_url;
  });
};

// cache is using gist now
export const cacheGet = async () => {
  // no need for the github api to get this
  const rawUrl = await raw();
  const response = await ky.get(rawUrl);
  const text = await response.text();
  return text && decompress(text);
};
