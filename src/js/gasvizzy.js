const GitData = require("./classes/GitData");
const { enumerateManifests } = require("./gasser");
const { cacheGet } = require("./cache");
export const delay = require("delay");
const { initFiltering } = require("./filtering");

// preferably get from redis
const getFromCache = async () => {
  return cacheGet().then((result) => {
    const { value, timestamp } = result || {};
    if (value) {
      console.log(
        `Using cached data from ${(new Date().getTime() - timestamp) /
          60 /
          1000 /
          60} hours ago`
      );
      return {
        gd: new GitData(value),
        timestamp,
      };
    }
  });
};

export const gasVizzyInit = () => {
  return getFromCache().then(({ gd, timestamp }) => {
    const mf = enumerateManifests(gd);
    const { dob, fob } = initFiltering({ gd, mf });
    // for convenience we'll put a pointer to the content in the files section
    gd.files.forEach((f) => {
      // get the matching shax
      const shax = gd.shaxs.get(f.fields.sha);
      // add a pointer to the shared content
      f.fields.content = shax.fields.content;
    });
    return {
      gd,
      mf,
      timestamp,
      dob,
      fob,
    };
  });
};
