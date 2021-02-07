class GasManifest {
  constructor(shax) {
    this.shax = shax;
    this.manifest = this.shax && this.shax.fields && this.shax.fields.content;
  }

  get id() {
    return this.shax && this.shax.fields && this.shax.fields.id;
  }

  prop(type) {
    return this.manifest && this.manifest[type];
  }

  get advancedServices() {
    return this.dependencies && this.dependencies.enabledAdvancedServices;
  }
  
  get libraries() {
    /* 
      "developmentMode": boolean,
      "libraryId": string,
      "userSymbol": string,
      "version": string
    */
    return this.dependencies && this.dependencies.libraries;
  }
  get dependencies() {
    /* 
    "serviceId": string,
    "userSymbol": string,
    "version": string
  */
    return this.prop("dependencies");
  }
  get timeZone() {
    return this.prop("timeZone");
  }
  get addOns() {
    return this.prop("addOns");
  }

  get runtimeVersion() {
    return this.prop("runtimeVersion");
  }
  get webapp() {
    return this.prop("webapp");
  }
  get oauthScopes() {
    return this.prop("oauthScopes");
  }
  get dataStudio() {
    return this.prop("dataStudio");
  }
  get firstRepoName() {
    return (
      this.shax &&
      this.shax &&
      this.shax.fields &&
      this.shax.fields.repoFullName
    );
  }
}

module.exports = GasManifest;
