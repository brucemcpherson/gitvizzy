class GasManifest {
  constructor(file) {
    this.file = file;
    const content = this.file && this.file.fields && this.file.fields.content;
    try {
      // some manifests have trailing commas, we can fix it by double parsing
      const t = JSON.stringify(content);
      this.manifest = t ? JSON.parse(JSON.parse(t)) : null;
    } catch (err) {
      console.log(
        "skipping after failed to parse manifest",
        this.file.fields.html_url,
        content
      );
      this.manifest = null;
    }
  }

  get id() {
    return this.file.id;
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
}

module.exports = GasManifest;
