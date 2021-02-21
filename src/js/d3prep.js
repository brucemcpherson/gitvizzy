const d3 = require("d3");
import { reduceManifests } from "./filtering";

const sorter = (items) =>
  items.sort((a, b) => {
    const aName = a.fields.name;
    const bName = b.fields.name;
    return aName === bName ? 0 : aName > bName ? 1 : -1;
  });

const manifestChild = ({
  manifestType,
  target,
  repoName,
  repoUrl,
  ownerPic,
  skipVersions = false,
}) => {
  // some manifests are arrays, so are not
  if (!Array.isArray(target)) target = [target];

  const children = target.map((g) => {
    // various strategies for picking up the description
    let name = null;
    let list = null;

    if (typeof g === "string") {
      name = g.replace("https://www.googleapis.com/auth/", "");
      list = [g];
    } else if (manifestType === "addOns") {
      if (g.id) {
        name = g.id;
        list = [g.id];
      } else {
        name = Object.keys(g).join(",");
        list = Object.keys(g);
      }
    } else {
      name = g.userSymbol || g.access || g.name;
      list = [g.libraryId || g.serviceId || name];
      if (g.version && !skipVersions)
        name += `.v${g.version}`.replace(".vv", ".v");
    }

    return {
      name,
      // empty children will mark the end of the tree for d3
      children: [],
      entry: g,
      list,
      type: "entries",
      manifestType,
      repoName,
      repoUrl,
      ownerPic,
    };
  });

  const pack = {
    name: manifestType,
    children,
    target,
    type: manifestType,
    repoName,
    repoUrl,
    ownerPic,
  };

  return pack;
};

const makeManifestChildren = ({
  mf,
  id,
  repoName,
  ownerPic,
  vTypes,
  repoUrl,
}) => {
  const manifest = mf.manifests.get(id);

  const m = vTypes
    .map((n) => {
      // eg libraries
      const f = n.name;
      // the values in the manifest for this type
      let target = manifest[f] || [];

      return manifestChild({
        manifestType: f,
        target,
        repoName,

        ownerPic,
        repoUrl,
      });
    })
    .filter((f) => f.children.length || f.childrenCount);

  return m;
};

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

export const arrangeTreeData = (state) => {
  // first job is to do a vanilla tree by owner
  const { viewType } = state;

  if (viewType === "owners") {
    const ownerTree = makeOwnerTreeData(state);
    return ownerTree;
  } else {
    const viewTree = makeManifestTreeData(state);
    return viewTree;
  }
};

export const makeOwnerTreeData = (state) => {
  // the objective is to make tree shaped data for d3
  // { name: owner, children: [{ name: repo: children: [{ name: libraries }, { name: advanced services }] }] }
  const { gd, dob, fob, showDetail, vTypes } = state;

  if (!gd || !state.mf) return null;

  // if theyre not interlocked, then the filtering hasnt been completed yet
  const mf = state.interlockedFilters ? state.mf : reduceManifests(state);

  // if there are no manifests after interlocking, then there's nothing to do yet
  if (!mf) return null;

  // we'll use this to further reduce the owners, which will contain all owners
  const reposByOwnerSet = new Set(
    fob.repos.allFiltered().map(dob.reposByOwner.accessor)
  );

  const owners = sorter(
    fob.owners
      .allFiltered()
      .filter((d) => reposByOwnerSet.has(dob.owners.accessor(d)))
  );

  const repos = fob.repos.allFiltered();
  const files = fob.files.allFiltered();

  // this is the kind of tree needed by d3
  const getOwnerAndChildren = ({ ownerOb }) => {
    const id = dob.owners.accessor(ownerOb);
    const children = repos
      .filter((s) => dob.reposByOwner.accessor(s) === id)
      .map((repoOb) => {
        const id = dob.repos.accessor(repoOb);
        const children = files
          .filter((s) => dob.filesByRepo.accessor(s) === id)
          .map((fileOb) => {
            const id = dob.files.accessor(fileOb);
            const manifest = mf.manifests.get(fileOb.fields.sha);
            const { path: fp } = fileOb.fields;
            return {
              ownerPic: ownerOb.fields.avatar_url,
              repoName: repoOb.fields.name,
              repoUrl: repoOb.fields.url,
              name: fp,
              manifest,
              id,
              type: "files",
              file: fileOb,
              // the children are each of the manifest options
              // but we dont need them if only  the abbreviated map is being shown
              children: showDetail
                ? makeManifestChildren({
                    mf,
                    id: fileOb.fields.sha,
                    state,
                    repoName: repoOb.fields.name,
                    repoUrl: repoOb.fields.url,
                    ownerPic: ownerOb.fields.avatar_url,
                    vTypes,
                  })
                : [],
            };
          });
        return {
          children,
          childrenCount: children.length,
          ownerPic: ownerOb.fields.avatar_url,
          repoName: repoOb.fields.name,
          repoUrl: repoOb.fields.url,
          repo: repoOb,
          name: repoOb.fields.name,
          type: "repos",
        };
      });

    return {
      children,
      childrenCount: children.length,
      owner: ownerOb,
      type: "owners",
      name: ownerOb.fields.name || ownerOb.fields.login,
      id,
    };
  };

  const t = Array.from(owners.values()).reduce(
    (p, c) => {
      const ownerChildren = getOwnerAndChildren({ ownerOb: c });
      p.children.push(ownerChildren);
      return p;
    },
    { name: "owners", children: [], type: "root" }
  );

  return t;
};

export const makeManifestTreeData = (state) => {
  const { gd, viewType, cfManifests, fob, dob, vTypes, filterPlus } = state;

  if (!gd || !state.mf) return null;

  // if theyre not interlocked, then the filtering hasnt been completed yet
  const mf = state.interlockedFilters ? state.mf : reduceManifests(state);

  // if there are no manifests after interlocking, then there's nothing to do yet
  if (!mf) return null;

  // use this as the base manifest type
  const base = cfManifests.allFiltered();

  // a map will make this easier to reference later
  const shaMap = fob.files.allFiltered().reduce((p, c) => {
    const sha = dob.filesBySha.accessor(c);
    if (!p.has(sha))
      p.set(sha, {
        files: [],
        sha,
      });
    p.get(sha).files.push(c);
    return p;
  }, new Map());

  const { idAccessor, filterName, objectKeys } = vTypes.find(
    (f) => viewType === f.name
  );
  const filterOb = state[filterName];

  // now create a tree with that as the base

  const t = base
    .filter(
      (f) =>
        f[viewType] &&
        ((typeof f[viewType] === "object" && Object.keys(f[viewType]).length) ||
          f[viewType].length)
    )
    .reduce((p, viewItem) => {
      // this will give something like the array of libraries in this manifest
      let a = objectKeys
        ? Object.keys(viewItem[viewType]).map((k) => {
            return {
              ...viewItem[viewType][k],
              id: k,
            };
          })
        : Array.isArray(viewItem[viewType])
        ? viewItem[viewType]
        : [viewItem[viewType]];

      a.forEach((g) => {
        // each viewtype  has a different style of id
        const id = idAccessor ? g[idAccessor] : g;
        if (!id) {
          console.log(idAccessor, viewType, g);
          throw new Error("couldnt find id for", idAccessor, g);
        }
        // this is organizing the qhole structure by selected viewtype
        // need to dump the parts of the manifest that are not required
        // because they weren't part of the filtering
        // TODO - there might be a good option for leaving them in
        // that would should related libraries for example as well as selected ones
        // by default we'll tkae them out

        if (!filterPlus || !filterOb.length || filterOb.indexOf(id) !== -1) {
          if (!p.has(id)) {
            p.set(id, {
              items: [],
              id,
              item: g,
            });
          }
          // just pile it all on - we'll need all this to sort it out late
          p.get(id).items.push({
            variant: g,
            viewItem,
          });
        }
      });

      return p;
    }, new Map());

  // now we have the whole thing arranged by viewtype
  // need to create a tree based on that and dispose of irrelevant thing
  const viewFiles = Array.from(t.values()).map((value) => {
    // borrow the code for making a child from the regular owner shaped tree
    // it'll only return 1 child
    const cl = manifestChild({
      manifestType: viewType,
      target: value.item,
      skipVersions: true,
    }).children;
    if (cl.length !== 1) {
      throw new Error("should hav returned a child for ", value.item);
    }
    const cld = cl[0];

    return {
      name: cld.name,
      // TODO the versions need to be updated using the variants and the names too
      entry: cld.entry,
      list: cld.list,
      manifestType: cld.manifestType,
      type: cld.type,
      children: value.items.reduce((p, f) => {
        // all the files that match this sha

        const sha = f.viewItem.id;
        const pc = p.concat(
          shaMap.get(sha).files.map((file) => {
            const repo = gd.repos.get(dob.filesByRepo.accessor(file));
            const owner = gd.owners.get(dob.reposByOwner.accessor(file));
            const id = dob.files.accessor(file);
            const manifest = mf.manifests.get(sha);
            const { path: fp } = file.fields;
            return {
              ownerPic: owner.fields.avatar_url,
              repoName: repo.fields.name,
              repoUrl: repo.fields.url,
              name: fp,
              manifest,
              id,
              type: "files",
              file,
              children: [
                {
                  ownerPic: owner.fields.avatar_url,
                  childrenCount: 1,
                  repoName: repo.fields.name,
                  repoUrl: repo.fields.url,
                  repo,
                  name: repo.fields.name,
                  type: "repos",
                  children: [
                    {
                      owner,
                      childrenCount: 0,
                      type: "owners",
                      name: owner.fields.name || owner.fields.login,
                      id: owner.fields.id,
                      children: [],
                    },
                  ],
                },
              ],
            };
          })
        );

        return pc;
      }, []),
    };
  }, []);

  return {
    name: viewType,
    children: viewFiles,
    type: "root",
  };
};
export const tree = ({ data, width }) => {
  if (!data || !width) return null;

  const root = d3.hierarchy(data);
  root.dx = 10;
  root.dy = width / (root.height + 1);
  return d3.tree().nodeSize([root.dx, root.dy])(root);
};
export const mapVersions = (ot) => {
  return (ot || []).map((f) => ({
    library: f,
    name: f.label,
    id: f.id,
    versionNames: `versions:${Array.from(f.versions.values())
      .map((g) => g.version)
      .join(",") || f.label}`,
  }));
};
export const getStats = () => {
  // generate a bunch of stats
  return {};
  /*
  return ["owners", "repos", "shaxs", "files"].reduce((p, c) => {
    p[c] = {
      list: getGdItem(state, c),
      count: {
        get() {
          return this.list.length;
        },
      },
    };

    return p;
  }, {});
  */
};
