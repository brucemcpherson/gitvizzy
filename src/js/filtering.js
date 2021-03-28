// using cross filter to manage the interlocked selectable filters
// this is all a bit more verbose than I'd hoped when I started out.

import cf from "crossfilter2";
import { enumerateManifests } from "./gasser";

const reduceRepos = ({ fob, dob, filters, filterPlus }) => {
  if (filters.owners.size && filterPlus) {
    const o = new Set(
      fob.owners
        .allFiltered()
        .map(dob.owners.accessor)
        .filter((f) => filters.owners.has(f))
    );
   
    dob.reposByOwner.filter((d) => o.has(d));
  } 
};

export const remakeMf = (state) => {
  const { fob, dob, filterPlus } = state;
  const dFilters = getDFilters(state);

  const repos = new Set(fob.repos.allFiltered().map(dob.repos.accessor));
  dob.filesByRepo.filter((d) => repos.has(d));

  const fileShas = new Set(
    fob.files.allFiltered().map(dob.filesBySha.accessor)
  );
  dob.shaxsByFile.filter((d) => fileShas.has(d));

  const mm = (name) =>
    new Map(fob[name].allFiltered().map((d) => [d.fields.id, d]));

  // new we can re-enumerate based on all those filters
  const mf = enumerateManifests({
    files: mm("files"),
    repos: mm("repos"),
    owners: mm("owners"),
    shaxs: mm("shaxs"),
  });

  // need to make a cross filter for all that
  const cfManifests = cf(Array.from(mf.manifests.values()));

  const dm = {
    timeZones: cfManifests.dimension((d) => d.timeZone || null),
    dataStudios: cfManifests.dimension(
      (d) => (d.dataStudio && d.dataStudio.name) || null
    ),
    runtimeVersions: cfManifests.dimension((d) => d.runtimeVersion || null),
    oauthScopes: cfManifests.dimension((d) => d.oauthScopes || [], true),
    addOns: cfManifests.dimension(
      (d) => (d.addOns && Object.keys(d.addOns)) || [],
      true
    ),
    webapps: cfManifests.dimension(
      (d) => (d.webapp && d.webapp.access) || null
    ),
    advancedServices: cfManifests.dimension(
      (d) =>
        (d.advancedServices && d.advancedServices.map((f) => f.serviceId)) ||
        [],
      true
    ),
    libraries: cfManifests.dimension(
      (d) => (d.libraries && d.libraries.map((f) => f.libraryId)) || [],
      true
    ),
  };

  // there might be some manifest filtering that feeds back into repos and users
  // for example - timezones
  if (filterPlus) {
    Object.keys(dm).forEach((k) => {
      if (dFilters[k].size) {
        dm[k].filter((d) => {
          return dFilters[k].has(d);
        });
      }
    });
  }

  return {
    mf,
    dm,
    cfManifests,
  };
};

const reduceOwners = ({ fob, dob, filters, filterPlus }) => {
  // if filtering on repos, reduce the owners to just the selected repos
  if (filters.repos.size && filterPlus) {
    // apply the repo filter, then pull out the owner ids they refer to
    // so  this will end up being a set of ownerIds belonging to the repos filter
    const r = new Set(
      fob.repos
        .allFiltered()
        .filter((d) => filters.repos.has(dob.repos.accessor(d)))
        .map(dob.reposByOwner.accessor)
    );
    // now filter the owners by that list
    dob.owners.filter((d) => r.has(d));
  }
};

export const reduceManifests = (state) => {
  const { cfManifests, dob, fob, mf } = state;
  const dFilters = getDFilters(state);

  // if that happened then we need to re limit files, repos et
  if (Object.keys(dFilters).some((k) => dFilters[k].size)) {
    // this is the list of shas that have something of interest
    const mans = new Set(cfManifests.allFiltered().map((f) => f.id));

    // filter out the files that share that sha
    dob.filesBySha.filter((d) => mans.has(d));

    // then we can filter out the repos that have them
    const repos = new Set(
      fob.files.allFiltered().map(dob.filesByRepo.accessor)
    );
    dob.repos.filter((d) => repos.has(d));

    // and also filter out all the owners
    const owners = new Set(
      fob.repos.allFiltered().map(dob.reposByOwner.accessor)
    );
    dob.owners.filter((d) => owners.has(d));
    const { mf: filteredMf } = remakeMf(state);
    return filteredMf;
  } else {
    return mf;
  }
};
export const getDFilters = (state) => {
  const {
    dataStudioFilter,
    addOnFilter,
    oauthScopeFilter,
    webappFilter,
    libraryFilter,
    advancedServiceFilter,
    runtimeVersionFilter,
    timeZoneFilter,
  } = state;

  const dFilters = {
    timeZones: new Set(timeZoneFilter || []),
    runtimeVersions: new Set(runtimeVersionFilter || []),
    advancedServices: new Set(advancedServiceFilter || []),
    libraries: new Set(libraryFilter || []),
    webapps: new Set(webappFilter || []),
    oauthScopes: new Set(oauthScopeFilter || []),
    addOns: new Set(addOnFilter || []),
    dataStudios: new Set(dataStudioFilter || []),
  };
  return dFilters;
};

export const applyFilters = (state) => {
  const {
    hireableOwners,
    interlockedFilters,
    filterPlus,
    fob,
    dob,
    ownerFilter,
    repoFilter,
  } = state;

  // first clear existing filter on repo and owner
  if(dob)Object.keys(dob).forEach((f) => dob[f].filterAll());

  // these are the vanilla filters
  const filters = {
    owners: new Set(ownerFilter || []),
    repos: new Set(repoFilter || []),
  };


  // apply hireable filter to both owner & repo
  if (hireableOwners && filterPlus) {
    dob.hireable.filter((d) => d);
    // get the filtered owners and apply to the repos
    const o = new Set(fob.owners.allFiltered().map(dob.owners.accessor));
    dob.reposByOwner.filter((d) => o.has(d));
  }

  // reduce the repos to just belong to selected owners
  reduceRepos({ fob, dob, filters, filterPlus });

  // if filtering on repos, reduce the owners to just the selected repos
  reduceOwners({ fob, dob, filters, filterPlus });

  // we need to remake the mf - so that needs a reduction of the manifest by these params.
  // first the relevant shaxs need filtered by repo - to do that we need to first filter the files
  const { mf, cfManifests } = remakeMf(state);

  // if that happened then we need to re limit files, repos et
  if (interlockedFilters) {
    return {
      mf: reduceManifests({ ...state, mf, cfManifests }),
      cfManifests,
    };
  } else {
    return {
      mf,
      cfManifests,
    };
  }
};

export const initFiltering = ({ gd }) => {
  const keys = Object.keys(gd).filter((f) => f !== "types");
  // standard cf
  const fob = keys.reduce((p, c) => {
    p[c] = cf(gd.items(c));
    return p;
  }, {});

  // id dimensions
  const dob = keys.reduce((p, c) => {
    p[c] = fob[c].dimension((d) => d.fields.id);
    return p;
  }, {});

  // various other more complex
  dob.reposByOwner = fob.repos.dimension((d) => d.fields.ownerId);
  dob.filesByRepo = fob.files.dimension((d) => d.fields.repositoryId);
  dob.shaxsByFile = fob.shaxs.dimension((d) => d.fields.id);
  dob.hireable = fob.owners.dimension((d) => d.fields.hireable);
  dob.filesBySha = fob.files.dimension((d) => d.fields.sha);

  return {
    dob,
    fob,
  };
};
