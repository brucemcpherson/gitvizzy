const d3 = require("d3");

const makeChildren = ({ map, matchId, id, state, filter, type }) => {
  const { filterPlus } = state || {};
  const children = Array.from(map.values())
    .filter((f) => f.fields[matchId] === id)
    .filter((f) => {
      return (
        !filter ||
        !filter.length ||
        !filterPlus ||
        filter.find((g) => g === f.fields.id)
      );
    })
    .map((f) => {
      return {
        ...f,
        type,
      };
    })
    .sort((a, b) => {
      return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
    });
  return children;
};

const makeManifestChildren = ({ mf, id, state }) => {
  const manifest = mf.manifests.get(id);
  const m = [
    {
      name: "libraries",
      filter: "libraryFilter",
    },
    {
      name: "advancedServices",
      filter: "advancedServiceFilter",
    },
    {
      name: "timeZone",
      filter: "timeZoneFilter",
    },
    {
      name: "runtimeVersion",
      filter: "runtimeVersionFilter",
    },
    {
      name: "webapp",
      filter: "webappFilter",
    },
    {
      name: "addOns",
      filter: "addOnFilter",
    },
    {
      name: "oauthScopes",
      filter: "oauthScopeFilter",
    },
    {
      name: "dataStudio",
      filter: "dataStudioFilter",
    },
  ].map((n) => {
    // eg libraries
    const f = n.name;
    // the currently active filter for this type
    const filter = state[n.filter];
    // whether filtering is even active
    const { filterPlus } = state;
    // the values in the manifest for this type
    let target = manifest[f] || [];
    // some manifests are arrays, so are not
    if (!Array.isArray(target)) target = [target];

    // for each item return whether they passed the filter
    // their children willbe the various value - a list of scopes etc
    // the manifest will be accepted if
    // each of the children present either pass filtering or there's no filtering for that item
    const children = target.map((g) => {
      // various strategies for picking up the description
      let name = null;
      let list = null;

      if (typeof g === "string") {
        name = g.replace("https://www.googleapis.com/auth/", "");
        list = [g];
      } else if (f === "addOns") {
        name = Object.keys(g).join(",");
        list = Object.keys(g);
      } else {
        name = g.userSymbol || g.access || g.name;
        list = [g.libraryId || g.serviceId || name];
        if (g.version) name += `.v${g.version}`.replace(".vv", ".v");
      }

      return {
        name,
        // empty children will mark the end of the tree for d3
        children: [],
        entry: g,
        list,
        type: "entries",
        manifestType: f
      };
    });

    const keep =
      // there is no filter
      !filter ||
      !filter.length ||
      !filterPlus ||
      // there's a filter but at least one of the children passes it
      (children.length &&
        children.some((g) => g.list.some((h) => filter.indexOf(h) !== -1)));

    const pack = {
      name: f,
      keep,
      children,
      target,
      type: f,
    };

    return pack;
  });

  // suppress any that dont have any children, and all of it if it fails filter
  return m.every((h) => h.keep) ? m.filter((h) => h.children.length) : [];
};

export const getGdItem = (state, type, filter) => {
  const { gd, filterPlus } = state;
  if (!gd) return null;

  const items = Array.from(gd[type].values())
    .filter((f) => {
      return (
        !filter ||
        !filter.length ||
        !filterPlus ||
        filter.find((g) => g === f.fields.id)
      );
    })
    .map((f) => {
      if (!f.fields.name) f.fields.name = f.fields.login;
      return {
        ...f,
        type,
      };
    })
    .sort((a, b) => {
      const aName = a.fields.name;
      const bName = b.fields.name;
      return aName === bName ? 0 : aName > bName ? 1 : -1;
    });

  return items;
};

export const getOwners = (state) =>
  getGdItem(state, "owners", state.ownerFilter);
export const getRepos = (state) => getGdItem(state, "repos", state.repoFilter);

const getDependencies = (mf, type) => {
  if (!mf) return null;
  const libraries = Array.from(mf.maps[type].values()).sort((a, b) => {
    const aName = a.label;
    const bName = b.label;
    return aName === bName ? 0 : aName > bName ? 1 : -1;
  });
  return libraries;
};

export const getLibraries = (mf) => getDependencies(mf, "libraries");
export const getAdvancedServices = (mf) =>
  getDependencies(mf, "advancedServices");
export const getAddOns = (mf) => getDependencies(mf, "addOns");
export const getOauthScopes = (mf) => getDependencies(mf, "oauthScopes");
export const getRuntimeVersions = (mf) =>
  getDependencies(mf, "runtimeVersions");
export const getWebapps = (mf) => getDependencies(mf, "webapps");
export const getDataStudios = (mf) => getDependencies(mf, "dataStudios");
export const getTimeZones = (mf) => getDependencies(mf, "timeZones");

export const makeOwnerTreeData = (state) => {
  // the objective is to make tree shaped data for d3
  // { name: owner, children: [{ name: repo: children: [{ name: libraries }, { name: advanced services }] }] }
  const { gd, mf } = state;
  if (!gd || !mf) return null;
  const owners = getOwners(state);
  if (!owners) return null;

  const t = owners.reduce(
    (p, c) => {
      const owner = {
        owner: c,
        name: c.fields.name,
        type: c.type,
        // the children are the repos
        children: makeChildren({
          map: gd.repos,
          matchId: "ownerId",
          id: c.fields.id,
          state,
          filter: state.repoFilter,
          type: "repos",
        }).map((f) => {
          return {
            repo: f,
            name: f.fields.name,
            type: f.type,
            // the children are the files
            children: makeChildren({
              map: gd.files,
              matchId: "repositoryId",
              id: f.fields.id,
              type: "files",
            })
              .map((g) => {
                const manifest = mf.manifests.get(g.fields.id);
                const { path: fp } = manifest.file.fields;
                return {
                  name: fp,
                  manifest,
                  type: g.type,
                  // the children are each of the manifest options
                  children: makeManifestChildren({
                    mf,
                    id: g.fields.id,
                    state,
                  }),
                };
              })
              .filter((g) => g.children.length),
          };
        }),
      };

      p.children.push(owner);
      return p;
    },
    { name: "owners", children: [] , type: "root"}
  );

  // rid of the branches with nothing to show
  t.children = t.children.map((o) => {
    o.children = o.children.filter((r) => r.children.length);
    return o;
  });

  // now trim top level
  t.children = t.children.filter((f) => f.children.length);

  // if we're not showing any detail, then we can drop everything below repo level
  if (!state.showDetail) {
    t.children = t.children.map((o) => {
      o.children = o.children.map((z) => {
        // remember for viz whats been suppressed
        z.childrenCount = z.children.length;
        z.childrenType = z.children[0].type;
        z.children = [];
        return z;
      });
      return o;
    });
  }

  return t;
};

export const tree = ({ data, width }) => {
  if (!data || !width) return null;
  const root = d3.hierarchy(data);
  root.dx = 10;
  root.dy = width / (root.height + 1);
  return d3.tree().nodeSize([root.dx, root.dy])(root);
};
