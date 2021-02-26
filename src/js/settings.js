const hash = require("object-hash");

const getKey = (key, keyId = "cache") => {
  if (typeof key === "undefined" || key === null) {
    throw new Error("undefined or null keys not allowed");
  }
  return hash({
    key,
    keyId,
  });
};

const queryDefinition = {
  query: {
    q: "filename:appsscript extension:.json",
  },
  keyId: "scrgit",
  get dataName() {
    return getKey({
      query: this.query,
      keyId: this.keyId,
    });
  },
  // the git hub api only does searches up to a 1000 results,
  // so we have to do multiple split by date
  ranges: [
    "size:<=100",
    "size:101..250",
    "size:251..400",
    "size:401..550",
    "size:>550",
  ],
  gistId: "9daba5fb20a97d020431fe4a114011c7",
  schemaVersion: '1.2',
  tokenSchemaVersion: '1.0',
  ttl: 1000 * 60 * 60 * 2,
  get gistApi() {
    return `https://api.github.com/gists/${this.gistId}`;
  },
};

module.exports = {
  queryDefinition,
  getKey,
};