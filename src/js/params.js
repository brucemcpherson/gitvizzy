// we can have parameters to directly go somewhere
const validParams = new Set(["manifest", "owner", "repo"]);
const validateParams = () => {
  const params = new URLSearchParams(window.location.search);
  // check we know them an they have values
  const keys = Array.from(params.keys());
  const isValid =
    keys.length < 2 && keys.every((f) => validParams.has(f) && params.get(f));
  const type = keys.length && Array.from(params.keys())[0];

  return {
    params,
    isValid,
    type,
    value: type && params.get(type),
    doit: isValid && keys.length,
    keys,
  };
};

export const dealWithParams = (store) => {
  const vp = validateParams();

  if (!vp.isValid) {
    store.commit("setShowError", {
      title: "Invalid parameters",
      message: vp.keys && vp.keys.join(","),
    });
  } else {
    store.commit("setUrlParams", vp);
  }
};

export const directLink = ({ item, type }) => {
  const l = window.location;
  let t = `${l.protocol}//${l.hostname}`;
  if (l.port) t += `:${l.port}`;

  return `${t}?${type}=${encodeURIComponent(itemAccessor({ item, type }))}`;
};

const itemAccessor = ({ item, type }) => {
  // this is where to find the data in a d3 each
  const b = item && item.data;

  // we're using manifest as alias for file in direct link
  if (type === "manifest" && b.type === "files") {
    const t = b && b.file && b.file.fields;
    const l = t && `${t.repoFullName}/${t.path}`;
    return l;
  } else if (type === "owner" && b.type === "owners") {
    const t = b && b.owner && b.owner.fields;
    const l = t && `${t.login}`;
    return l;
  } else if (type === "repo" && b.type === "repos") {
    const t = b && b.repo && b.repo.fields;
    const l = t && `${t.full_name}`;
    return l;
  }
};

const itemMatch = ({ item, type, target }) => {
  const value = itemAccessor({ item, type });
  return target === value;
};

export const itemFind = ({ node, target, type }) => {
  let foundling = null;
  if (node) {
    node.each(function(item) {
      if (!foundling && itemMatch({ item, type, target })) {
        foundling = {
          item,
          d3This: this,
        };
      }
    });
  }
  return foundling;
};
