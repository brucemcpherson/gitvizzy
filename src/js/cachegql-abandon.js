// NO point in the GQL version of the api
// it truncates string fields over 1mb, so I've had to scrap this
// will come back to it if there's a fix
const { decompress } = require("./compress");
const { queryDefinition } = require("./settings");
const { Octokit } = require("@octokit/rest");
const delay = require("delay");

import ky from "ky";
let kyg = null;
let octokit = null;

export const cacheInit = (store) => {
  octokit = new Octokit({
    auth: store.githubToken,
    userAgent: "scrviz v1.0.1",
  });
  kyg = ky.create({
    prefixUrl: "https://api.github.com",
    headers: {
      Authorization: `Bearer fc0562222353d85fb97cf9184446bc558f19230c`,
    },
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
  const u = url.replace("https://api.github.com", "GET ");
  return getWithWait(() =>
    octokit.request(u).then((r) => {
      return r.data;
    })
  );
};


// cache is using gist now
export const cacheGet = async () => {
  const text = await cacheFromGql();
  console.log(text)
  return text && decompress(text);
};

const getGist = () => `
  query ($name: String!) {
    viewer {
      gist(name: $name) {
        files {
          text
        }
      }
    }
  }
`;
const gq = (qv) => {
  return kyg("graphql", {
    method: "POST",
    json: qv,
  });
};

const cacheFromGql = async () => {
  const r = await gq({
    query: getGist(),
    variables: {
      name: queryDefinition.gistId,
    },
  }).json();
  const content =
    r &&
    r.data &&
    r.data.viewer &&
    r.data.viewer.gist &&
    r.data.viewer.gist.files &&
    r.data.viewer.gist.files[0] &&
    r.data.viewer.gist.files[0].text;
  return content;
};
