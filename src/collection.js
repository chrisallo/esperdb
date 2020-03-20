import EsdbQuery from "./query";
import EsdbError from "./error";
import EsdbMutex from "./utils/mutex";
import { clone } from "./utils/clone";

const _privateProps = new WeakMap();

export default class EsdbCollection {
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
      mutex: new EsdbMutex()
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
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.get(${key})`));
      }
    });
  }
  getAll(where, options = {}) {
    return new Promise((resolve, reject) => {
      if ((where instanceof EsdbQuery || where === null) && typeof options === 'object') {
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
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              const item = await kernel.get(this.name, doc[this.key], doc);
              if (!item) {
                resolve(await kernel.set(this.name, doc[this.key], doc));
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
        const { kernel, mutex } = _privateProps.get(this);
        if (kernel) {
          mutex.lock(async unlock => {
            try {
              const item = await kernel.get(this.name, doc[this.key], doc);
              if (item) {
                resolve(await kernel.set(this.name, doc[this.key], doc));
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
          reject(EsdbError.kernelNotLoaded());
        }
      } else {
        reject(EsdbError.invalidParams(`collection.removeIf()`));
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
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
}