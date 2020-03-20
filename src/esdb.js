import EsdbStore from './interface/store';
import EsdbEncryption from './interface/encryption';

import EsdbKernel from './kernel';
import EsdbCollection from './collection';
import EsdbQuery from './query';
import EsdbError from './error';

import EsdbLog from './utils/log';

/// constants
const ESDB_METADATA_KEY = 'esdb-metadata';
const ESDB_COLLECTION_PREFIX = 'esdb-collection-';

let _instance = null;
let _vault = null;

class Esdb {
  constructor() {
    if (!_instance) {
      _vault = {
        name: '',
        version: 1,
        store: new EsdbStore(),
        encryption: new EsdbEncryption(),
        schema: {},
        options: {},
        collection: {},
        error: null,
        state: Esdb.State.INIT
      };
      _instance = this;
    }
    return _instance;
  }
  static get State() {
    return {
      INIT: 'init',
      READY: 'ready'
    };
  }
  get isInit() {
    return _vault.state === Esdb.State.INIT;
  }
  get isReady() {
    return _vault.state === Esdb.State.READY;
  }
  name(val) {
    if (!_vault.error) {
      if (typeof val === 'string' && val) {
        if (this.isInit) {
          _vault.name = val;
        } else {
          _vault.error = EsdbError.immutableReadyState();
        }
      } else {
        _vault.error = EsdbError.invalidParams(`esdb.name(${val})`);
      }
    }
    return this;
  }
  version(val) {
    if (!_vault.error) {
      if (typeof val === 'number' && val > 0) {
        if (this.isInit) {
          _vault.version = val;
        } else {
          _vault.error = EsdbError.immutableReadyState();
        }
      } else {
        _vault.error = EsdbError.invalidParams(`esdb.version(${val})`);
      }
    }
    return this;
  }
  store(val) {
    if (!_vault.error) {
      if (val instanceof EsdbStore) {
        if (this.isInit) {
          _vault.store = val;
        } else {
          _vault.error = EsdbError.immutableReadyState();
        }
      } else {
        _vault.error = EsdbError.invalidParams(`esdb.store(${val})`);
      }
    }
    return this;
  }
  config(val) {
    if (!_vault.error) {
      if (typeof val === 'object' && val) {
        if (this.isInit) {
          _vault.options = val;
        } else {
          _vault.error = EsdbError.immutableReadyState();
        }
      } else {
        _vault.error = EsdbError.invalidParams(`esdb.config(${val})`);
      }
    }
    return this;
  }
  encryption(val) {
    if (!_vault.error) {
      if (val instanceof EsdbEncryption) {
        if (this.isInit) {
          _vault.encryption = val;
        } else {
          _vault.error = EsdbError.immutableReadyState();
        }
      } else {
        _vault.error = EsdbError.invalidParams(`esdb.encryption(${val})`);
      }
    }
    return this;
  }
  schema(val) {
    if (!_vault.error) {
      const { name, model, key, indexes = [], migrate = null } = val;
      if (typeof name === 'string' && name
        && typeof model === 'object' && model
        && typeof key === 'string' && key
        && Array.isArray(indexes)
        && indexes.every(index =>
          Array.isArray(index)
          && index.length > 0
          && index.every(column => typeof column === 'string' && model.hasOwnProperty(column)))
        && (typeof migrate === 'function' || migrate === null)) {
        if (this.isInit) {
          _vault.schema[name] = { model, key, indexes, migrate };
        } else {
          _vault.error = EsdbError.immutableReadyState();
        }
      } else {
        _vault.error = EsdbError.invalidParams(`esdb.schema(${val})`);
      }
    }
    return this;
  }
  async build() {
    if (!_vault.error) {
      try {
        const { name, version, store, schema } = _vault;
        await store.init();

        let metadata = await store.getItem(ESDB_METADATA_KEY);
        let oldVersion = null;
        let versionUpgraded = false;
        if (metadata && metadata.version !== version) {
          oldVersion = metadata.version;
          versionUpgraded = true;
        }

        const kernel = new EsdbKernel({
          name,
          store,
          encryption: _vault.encryption,
          options: _vault.options
        });
        for (let name in schema) {
          const collectionStoreKey = `${ESDB_COLLECTION_PREFIX}${name}`;
          const { model, key, indexes, migrate } = schema[name];

          const collection = new EsdbCollection({ name, key, kernel });
          const collectionInfo = await store.getItem(collectionStoreKey);
          if (collectionInfo) {
            if (versionUpgraded) {
              if (migrate) {
                const data = await collection.getAll();
                for (let i in data) {
                  const isDirty = await migrate(oldVersion, data[i]);
                  if (isDirty) {
                    await collection.update(data[i]);
                  }
                }
              }

              // TODO: check if indexes has changed and upgrade indexes here

              if (key !== collectionInfo.key) {
                // TODO: upgrade the key here
              }
            }
          }
          await store.setItem(collectionStoreKey, { model, key, indexes });
          _vault.collection[name] = collection;
        }
        // set metadata
        await store.setItem(ESDB_METADATA_KEY, JSON.stringify({ name, version, schema }));
      } catch (e) {
        EsdbLog.error(e.message);
      }
    } else {
      EsdbLog.error(_vault.error.message);
    }
  }
  collection(name) {
    let col = null;
    if (!_vault.error) {
      if (this.isReady) {
        if (typeof name === 'string'
          && _vault.collection.hasOwnProperty(name)
          && _vault.collection[name] instanceof EsdbCollection) {
          col = _vault.collection[name];
        } else {
          EsdbLog.error(EsdbError.invalidParams(`esdb.collection(${name})`));
        }
      } else {
        EsdbLog.error(EsdbError.databaseNotReady());
      }
    }
    return col;
  }
}

export {
  EsdbQuery,
  EsdbError,
  EsdbStore,
  EsdbEncryption
};
export default new Esdb();