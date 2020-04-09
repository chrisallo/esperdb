import EsperQuery from "./query";
import EsperError from "./error";

import EsperTransaction from "./kernel/lib/transaction";
import EsperIndexer from "./kernel/lib/indexer";

import EsperMutex from "./utils/mutex";

const _privateProps = new WeakMap();

export default class EsperCollection {
  constructor({
    name = '',
    key = '',
    indexes = [],
    store = null,
    encryption = null
  }) {
    const batchQueue = new EsperTransaction(store);
    const indexers = [];
    let keyIndexer = null;
    for (let i in indexes) {
      const indexer = new EsperIndexer({
        collectionName: name,
        primaryKey: key,
        columns: indexes[i]
      });
      indexers.push(indexer);
      if (indexer.columns.length === 1 && indexer.columns[0] === key) {
        keyIndexer = indexer;
      }
    }
    _privateProps.set(this, {
      name,
      key,
      batchQueue,
      keyIndexer,
      indexers,
      store,
      encryption,
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
  get indexes() {
    const { indexers } = _privateProps.get(this);
    return indexers.map(idxr => idxr.columns);
  }
  get(key) {
    return new Promise((resolve, reject) => {
      if (typeof key === 'string') {
        // const { keyIndexer, store, encryption, mutex } = _privateProps.get(this);
        // if (keyIndexer) {
        //   mutex.lock(unlock => {
        //     keyIndexer.iterate({ [this.key]: key }, { limit: 1 }, indexItem => {
        //       if (indexItem[this.key] === key) {
        //         // get the block
        //         store.getItem(indexItem.blockKey)
        //           .then(rawBlock => {
        //             if (rawBlock) {
        //               const serializedData = encryption ? encryption.decrypt(rawBlock) : rawBlock;
        //               const block = new EsperBlock({ blockKey: key, serializedData });
        //               resolve(block[key]);
        //             } else {
        //               reject(EsperError.blockNotFound());
        //             }
        //           })
        //           .catch(e => reject(e))
        //           .finally(() => unlock());
        //       } else {
        //         // data not found
        //         resolve(null);
        //       }
        //     });
        //     unlock();
        //   });
        // } else {
        //   reject(EsperError.keyNotIndexed());
        // }
      } else {
        reject(EsperError.invalidParams(`collection.get(${key})`));
      }
    });
  }
  getAll(where, options = {}) {
    return new Promise((resolve, reject) => {
      if ((where instanceof EsperQuery || where === null) && typeof options === 'object') {
        const { indexers, store, mutex } = _privateProps.get(this);
        const best = { indexer: null, score: -1 };
        for (let i in indexers) {
          const score = indexers[i].calculateScore(where, options);
          if (score > best.score) {
            best.indexer = indexers[i];
            best.score = score;
          }
        }
        if (best.indexer) {
          mutex.lock(unlock => {
            const indexerQuery = {};
            // TODO: create indexerQuery

            // TODO: find values
            resolve([]);

            unlock();
          });
        } else {
          reject(EsperError.keyNotIndexed());
        }
      } else {
        reject(EsperError.invalidParams(`collection.getAll()`));
      }
    });
  }
  count(where) {
    return new Promise((resolve, reject) => {
      if (where instanceof EsperQuery) {
        this.getAll(where)
          .then(list => resolve(list.length))
          .catch(err => reject(err));
      } else if (where === null) {
        const { keyIndexer } = _privateProps.get(this);
        if (keyIndexer) {
          resolve(keyIndexer.count);
        } else {
          reject(EsperError.keyNotIndexed());
        }
      } else {
        reject(EsperError.invalidParams(`collection.count()`));
      }
    });
  }
  insert(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        // TODO:
      } else {
        reject(EsperError.invalidParams(`collection.insert(${doc})`));
      }
    });
  }
  upsert(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        // TODO:
      } else {
        reject(EsperError.invalidParams(`collection.upsert(${doc})`));
      }
    });
  }
  update(doc) {
    return new Promise((resolve, reject) => {
      if (typeof doc === 'object' && doc !== null && doc.hasOwnProperty(this.key)) {
        // TODO:
      } else {
        reject(EsperError.invalidParams(`collection.update(${doc})`));
      }
    });
  }
  remove(key) {
    return new Promise((resolve, reject) => {
      if (typeof key === 'string') {
        // TODO:
      } else {
        reject(EsperError.invalidParams(`collection.remove(${key})`));
      }
    });
  }
  updateIf(setter, where) {
    return new Promise((resolve, reject) => {
      if (typeof setter === 'object' && setter !== null && where instanceof EsperQuery) {
        // TODO:
      } else {
        reject(EsperError.invalidParams(`collection.updateIf()`));
      }

    });
  }
  removeIf(where) {
    return new Promise((resolve, reject) => {
      if (where instanceof EsperQuery) {
        // TODO:
      } else {
        reject(EsperError.invalidParams(`collection.removeIf()`));
      }

    });
  }
  clear() {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
}