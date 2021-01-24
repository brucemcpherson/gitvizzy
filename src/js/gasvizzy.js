const GitData = require("./classes/GitData");
const { enumerateManifests } = require("./gasser");
const { cacheGet } = require("./cache");
export const delay = require("delay");

// preferably get from redis
const getFromCache = async () => {

  return cacheGet().then((result) => {
    
    const { value, timestamp } = result || {};
    if (value) {
      console.log(
        `Using cached data from ${
          (new Date().getTime() - timestamp) / 60 / 1000 / 60
        } hours ago`
      );
      return {
        gd: new GitData(value),
        timestamp
      }
    } 
  });
};

export const gasVizzyInit = () => { 
 
  return getFromCache()
    .then(({ gd, timestamp }) => ({
      gd,
      mf: enumerateManifests(gd),
      timestamp
    }));
}
