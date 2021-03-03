/* global gapi */

export const createProject = ({ title, contents, parentId }) => {
  const pack = {
    title,
  };
  if (parentId) pack.parentId = parentId;
  return gapi.client.script.projects.create(pack).then((response) => {
    const { result } = response;
    const { error, scriptId } = result;
    if (error) throw new Error(error);
    if (!contents) return result;
  
    const files = contents.map((f) => {
      return {
        name: f.gasName,
        type: f.gasType,
        source: f.content,
      };
    });

    // special patch for bugin the API where there is more than one file with the same name
    // typically this would be index.html and index.js confusion
    // we'll just rename one of them 
    files.forEach((f,i,a) => { 
      if(a.findIndex(g=>g.name === f.name) !== i) f.name = f.name + i
    })

    return gapi.client.script.projects.updateContent({
      scriptId,
      resource: {
        files,
      },
    });
  });
};
