const GasManifests = require("./classes/GasManifests");
const enumerateManifests = (gd) => {
  const mf = new GasManifests(gd);
  const maps = {
    advancedServices: new Map(),
    libraries: new Map(),
    timeZones: new Map(),
    webapps: new Map(),
    runtimeVersions: new Map(),
    addOns: new Map(),
    oauthScopes: new Map(),
    dataStudios: new Map()
  };
  mf.maps = maps;

  const add = ({ prop, item, map, id, version }) => {
    if (item[prop]) {
      const props = Array.isArray(item[prop]) ? item[prop] : [item[prop]];
      props.forEach((g) => {
        const idValue = id ? g[id] : g;
        if (!map.has(idValue)) {
          map.set(idValue, {
            id: idValue,
            versions: new Map(),
            label: g.userSymbol || idValue,
          });
        }
        const a = map.get(idValue);
        const versionValue = version ? g[version] : g;
        if (!a.versions.has(versionValue)) {
          a.versions.set(versionValue, g);
        }
      });
    }
  };

  const addAddon = ({ item, map }) => {
   
    if (item.addOns) {
      Object.keys(item.addOns).forEach((f) => {
        if (!map.has(f)) {
          map.set(f, {
            id: f,
            versions: new Map(),
            label: f,
          });
          map.get(f).versions.set(f, item.addOns[f]);
        }
      });
    }
  };

  mf.manifests.forEach((f) => {
    if (f.manifest) {
      add({
        prop: "advancedServices",
        item: f,
        map: maps.advancedServices,
        version: "version",
        id: "serviceId",
      });
      add({
        prop: "libraries",
        item: f,
        map: maps.libraries,
        version: "version",
        id: "libraryId",
      });
      add({
        prop: "timeZone",
        item: f,
        map: maps.timeZones,
        version: "timeZone",
        id: null,
      });
      add({
        prop: "dataStudio",
        item: f,
        map: maps.dataStudios,
        version: "description",
        id: "name",
      });
      add({
        prop: "runtimeVersion",
        item: f,
        map: maps.runtimeVersions,
        version: "runtimeVersion",
        id: null,
      });
      add({
        prop: "webapp",
        item: f,
        map: maps.webapps,
        version: "executeAs",
        id: "access",
      });
      add({
        prop: "oauthScopes",
        item: f,
        map: maps.oauthScopes,
        version: null,
        id: null,
      });
      addAddon({
        item: f,
        map: maps.addOns,
      });
    }
  });
  return mf;
};

module.exports = {
  enumerateManifests,
};
