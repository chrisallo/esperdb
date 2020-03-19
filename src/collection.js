
export default class EsdbCollection {
  constructor({ name = '' }) {
    this.name = name;
  }
  get(key) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  getAll(where) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  count(where) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  insert(doc) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  upsert(doc) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  update(doc) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  remove(key) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }

  updateIf(setter, where) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  removeIf(where) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  clear() {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
}