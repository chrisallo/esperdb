import { EsdbError } from "./esdb";

const _kernel = new WeakMap();

export default class EsdbCollection {
  constructor({
    name = '',
    key = '',
    kernel = null
  }) {
    this.name = name;
    this.key = key;
    _kernel.set(this, kernel);
  }
  get(key) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  getAll(where) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  count(where) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  insert(doc) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  upsert(doc) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  update(doc) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  remove(key) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }

  updateIf(setter, where) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  removeIf(where) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  clear() {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        // TODO:
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
}