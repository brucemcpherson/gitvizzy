const GitFile = require("./GitFile.js");
const GitOwner = require("./GitOwner.js");
const GitRepo = require("./GitRepo.js");
const GitShax = require("./GitShax.js");
const types = ["shaxs", "files", "owners", "repos"];

class GitData {
  constructor(data) {
    this.types = types;
    if (data) {
      this.import(data);
    } else {
      this.repos = new Map();
      this.owners = new Map();
      this.files = new Map();
      this.shaxs = new Map();
    }
  }

  export() {
    return this.types.reduce((p, c) => {
      p[c] = this.fields(c);
      return p;
    }, {});
  }

  import(data) {
    this.owners = new Map(
      data.owners.map((f) => [f.id, new GitOwner({ importFields: f })])
    );
    this.repos = new Map(
      data.repos.map((f) => [f.id, new GitRepo({ importFields: f })])
    );
    this.shaxs = new Map(
      data.shaxs.map((f) => [f.id, new GitShax({ importFields: f })])
    );
    this.files = new Map(
      data.files.map((f) => [f.id, new GitFile({ importFields: f })])
    );
    return this;
  }


  add(data) {
    const file = new GitFile(data);
    this.files.set(file.fields.id, file);
    this.getOrAddRepo(data);
    this.getOrAddOwner(data);
    this.getOrAddShax(data);
  }

  getOrAddRepo(data) {
    if (!this.repos.has(data.repository.id)) {
      const repo = new GitRepo(data);
      this.repos.set(repo.fields.id, repo);
    }
    return this.repos.get(data.repository.id);
  }

  getOrAddOwner(data) {
    if (!this.owners.has(data.repository.owner.id)) {
      const owner = new GitOwner(data);
      this.owners.set(owner.fields.id, owner);
    }
    return this.owners.get(data.repository.owner.id);
  }

  getOrAddShax(data) {
    if (!this.shaxs.has(data.sha)) {
      const shax = new GitShax(data);
      this.shaxs.set(shax.fields.id, shax);
    }
    return this.shaxs.get(data.sha);
  }

  items(type) {
    const input = this[type];
    if (!input) throw new Error(`invalid type ${type}`);
    return Array.from(input.values());
  }

  fields(type) {
    const items = this.items(type);
    return items.map((f) => f.fields);
  }

}

module.exports = GitData;
