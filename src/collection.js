import { EsdbError } from "./esdb";
import EsdbMutex from "./utils/mutex";
import EsdbQuery from "./query";

const _kernel = new WeakMap();
const _mutex = new WeakMap();

export default class EsdbCollection {
  constructor({
    name = '',
    key = '',
    kernel = null
  }) {
    this.name = name;
    this.key = key;
    _kernel.set(this, kernel);
    _mutex.set(this, new EsdbMutex());
  }
  get(key) {
    return new Promise((resolve, reject) => {
      if (typeof key === 'string') {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            try {
              resolve(await kernel.get(this, key));
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.get(${key})`));
      }
    });
  }
  getAll(where, options = null) {
    return new Promise((resolve, reject) => {
      if ((where instanceof EsdbQuery || where === null)
        && (typeof options === 'object') || (typeof options === 'undefined')) {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            // TODO:
            unlock();
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.getAll()`));
      }

    });
  }
  count(where) {
    return new Promise((resolve, reject) => {
      if (where instanceof EsdbQuery) {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            // TODO:
            unlock();
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.count()`));
      }
    });
  }
  insert(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            try {
              const item = await kernel.get(this, doc[this.key], doc);
              if (!item) {
                resolve(await kernel.set(this, doc[this.key], doc));
              } else {
                throw EsdbError.dataAlreadyExists();
              }
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.insert(${doc})`));
      }
    });
  }
  upsert(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            try {
              resolve(await kernel.set(this, doc[this.key], doc));
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.upsert(${doc})`));
      }
    });
  }
  update(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            try {
              const item = await kernel.get(this, doc[this.key], doc);
              if (item) {
                resolve(await kernel.set(this, doc[this.key], doc));
              } else {
                throw EsdbError.dataNotFound();
              }
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.update(${doc})`));
      }
    });
  }
  remove(key) {
    return new Promise((resolve, reject) => {
      if (typeof key === 'string') {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            try {
              resolve(await kernel.remove(this, key));
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.remove(${key})`));
      }
    });
  }

  updateIf(setter, where) {
    return new Promise((resolve, reject) => {
      if (typeof setter === 'object' && setter !== null && where instanceof EsdbQuery) {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            // TODO:
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.updateIf()`));
      }

    });
  }
  removeIf(where) {
    return new Promise((resolve, reject) => {
      if (where instanceof EsdbQuery) {
        const kernel = _kernel.get(this);
        if (kernel) {
          const mutex = _mutex.get(this);
          mutex.lock(async unlock => {
            // TODO:
          });
        } else {
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.removeIf()`));
      }

    });
  }
  clear() {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(async unlock => {
          try {
            await kernel.clear(this);
            resolve();
          } catch (e) {
            reject(e);
          } finally {
            unlock();
          }
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
}