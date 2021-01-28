const decorations = [];

class GitFile {

  constructor(data) {
    if (data.importFields) {
      this.fields = data.importFields;
    } else {
      this.fields = [
        "html_url",
        "name",
        "path",
        "sha",
        "url",
        "repositoryId",
        "ownerId",
        "id",
      ].reduce((p, c) => {
        p[c] = data[c];
        return p;
      }, {});
      this.fields.repositoryId = data.repository.id;
      this.fields.ownerId = data.repository.owner.id;
      this.fields.id = this.fields.url;
      this.fields.repoFullName = data.repository.full_name;
    }
  }
  decorate(body) {
    if (body) {
      decorations.forEach((f) => {
        this.fields[f] = body[f];
      });
    }
  }
}
module.exports = GitFile;
