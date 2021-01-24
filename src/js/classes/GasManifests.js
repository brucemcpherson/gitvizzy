const GasManifest = require('./GasManifest')

class GasManifests {
  constructor({ files }) {
    this.manifests =  new Map(
      Array.from(files, ([key, file]) => [key, new GasManifest(file)])
    );
    this._maps = null
  }
  get maps() { 
    return this._maps
  }
  set maps(value) { 
    this._maps = value
  }
  labels (type) { 
    return Array.from(this.maps[type]).map(([id,value]) => ({ 
      id,
      label: value.label
    }))
  }
}
module.exports = GasManifests