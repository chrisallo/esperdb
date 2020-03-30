import EsperQuery from "./query";
import EsperError from "./error";
import EsperMutex from "./utils/mutex";
import { clone } from "./utils/clone";

const _privateProps = new WeakMap();

export default class EsperCollection {
  constructor({
    name = '',
    key = '',
    model = null,
    indexer = null,
    kernel = null
  }) {
    _privateProps.set(this, {
      name,
      key,
      model,
      indexer,
      kernel,
      mutex: new EsperMutex()
    });
  }
  get name() {
    const { name } = _privateProps.get(this);
    return name;
  }
  get key() {
    const { key } = _privateProps.get(this);
    return key;
  }
  get model() {
    const { model } = _privateProps.get(this);
    return clone(model);
  }
  get indexes() {
    const { indexer } = _privateProps.get(this);
    return clone(indexer.indexes);
  }
  get(key) {
    return new Promise((resolve, reject) => {
      if (typeof key === 'string') {
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              resolve(await kernel.get(this.name, key));
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.get(${key})`));
      }
    });
  }
  getAll(where, options = {}) {
    return new Promise((resolve, reject) => {
      if ((where instanceof EsperQuery || where === null) && typeof options === 'object') {
        const { kernel, indexer, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              const index = indexer.findBestIndexForQuery(where, options);
              if (index) {
                // TODO: fetch indextable for listing
              } else {
                let result = [];
                await kernel.each(this.name, async (_, item) => {
                  if (!where || where.match(item)) {
                    result.push(item);
                  }
                });
                if (options.orderBy) {
                  const sortKey = options.orderBy.replace(/^--/, '');
                  const desc = /^--/.test(options.orderBy);
                  result = result.sort((a, b) => desc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
                }
                if (options.offset) {
                  result = result.slice(options.offset);
                }
                if (options.limit) {
                  result = result.slice(0, options.limit);
                }
                resolve(result);
              }
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.getAll()`));
      }

    });
  }
  count(where) {
    return new Promise((resolve, reject) => {
      if (where instanceof EsperQuery) {
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              if (where) {
                let count = 0;
                await kernel.each(this.name, async (_, item) => {
                  if (where.match(item)) {
                    count++;
                  }
                });
                resolve(count);
              } else {
                resolve(await kernel.count(this.name));
              }
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.count()`));
      }
    });
  }
  insert(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              const item = await kernel.get(this.name, doc[this.key], doc);
              if (!item) {
                resolve(await kernel.set(this.name, doc[this.key], doc));
              } else {
                throw EsperError.dataAlreadyExists();
              }
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.insert(${doc})`));
      }
    });
  }
  upsert(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              resolve(await kernel.set(this.name, doc[this.key], doc));
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.upsert(${doc})`));
      }
    });
  }
  update(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              const item = await kernel.get(this.name, doc[this.key], doc);
              if (item) {
                resolve(await kernel.set(this.name, doc[this.key], doc));
              } else {
                throw EsperError.dataNotFound();
              }
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.update(${doc})`));
      }
    });
  }
  remove(key) {
    return new Promise((resolve, reject) => {
      if (typeof key === 'string') {
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              resolve(await kernel.remove(this.name, key));
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.remove(${key})`));
      }
    });
  }
  updateIf(setter, where) {
    return new Promise((resolve, reject) => {
      if (typeof setter === 'object' && setter !== null && where instanceof EsperQuery) {
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              const updatedItems = [];
              await kernel.each(this.name, async (key, item) => {
                if (where.match(item)) {
                  for (let column in setter) {
                    item[column] = setter[column];
                  }
                  await kernel.set(this.name, key, item);
                  updatedItems.push(item);
                }
              });
              resolve(updatedItems);
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.updateIf()`));
      }

    });
  }
  removeIf(where) {
    return new Promise((resolve, reject) => {
      if (where instanceof EsperQuery) {
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              const removedItems = [];
              await kernel.each(this.name, async (key, item) => {
                if (where.match(item)) {
                  await kernel.remove(this.name, key);
                  removedItems.push(item);
                }
              });
              resolve(removedItems);
            } catch (e) {
              reject(e);
            } finally {
              unlock();
            }
          });
        } else {
          reject(EsperError.kernelNotLoaded());
        }
      } else {
        reject(EsperError.invalidParams(`collection.removeIf()`));
      }

    });
  }
  clear() {
    return new Promise((resolve, reject) => {
      const { kernel, mutex } = _privateProps.get(this);
      if (kernel) {
        mutex.lock(async unlock => {
          try {
            await kernel.clear(this.name);
            resolve();
          } catch (e) {
            reject(e);
          } finally {
            unlock();
          }
        });
      } else {
        reject(EsperError.kernelNotLoaded());
      }
    });
  }
}