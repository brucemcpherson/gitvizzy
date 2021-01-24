class GitShax {

  constructor(data) {
    if (data.importFields) {
      this.fields = data.importFields;
    } else {
      this.fields = [].reduce((p, c) => {
        p[c] = data[c];
        return p;
      }, {});
      this.fields.id = data.sha;
    }
  }

}
module.exports = GitShax;
