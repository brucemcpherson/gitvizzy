// this is all about using local storage
import localForage from "localforage";
import { queryDefinition } from "./settings";
const tokenKey = "tokes";
const cacheKey = "cache";
const { ttl, schemaVersion, tokenSchemaVersion } = queryDefinition;

let forager = null;
let tokenForager = null;
export const forageInit = () => {
  const name = "vizzy";
  forager = localForage.createInstance({
    name,
    storeName: "scrviz",
    description: "for data github scrviz data caching",
  });
  tokenForager = localForage.createInstance({
    name,
    storeName: "scrviztokens",
    description: "for scrviz tokens",
  });
};

const getStuff = (frg, key, schemaVersion) =>
  frg.getItem(key).then((r) => {
    return (
      r &&
      r.value &&
      r.schemaVersion === schemaVersion &&
      (!r.expiry || r.expiry > new Date().getTime()) &&
      r.value
    );
  });

// get from cache if it hasnt expired and if its a good version
export const getCacheData = () => getStuff(forager, cacheKey, schemaVersion);

// get tokens from cache
export const getTokenData = () =>
  getStuff(tokenForager, tokenKey, tokenSchemaVersion);

// put data to cache
const setVizzyStuff = (frg, key, value, schemaVersion, ttl) =>
  frg.setItem(key, {
    value,
    expiry: ttl ? new Date().getTime() + ttl : null,
    schemaVersion,
  });

export const setTokenData = (value) =>
  setVizzyStuff(tokenForager, tokenKey, value, tokenSchemaVersion);

export const setCacheData = (value) =>
  setVizzyStuff(forager, cacheKey, value, schemaVersion, ttl);
