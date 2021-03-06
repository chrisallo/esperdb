import EsperStore from './interface/store';
import EsperEncryption from './interface/encryption';

import EsperCollection from './collection';
import EsperQuery from './query';
import EsperError from './error';

import EsperLog from './utils/log';

/// constants
const ESPER_METADATA_KEY = 'esper-meta';
const ESPER_COLLECTION_PREFIX = 'esper-col-';

let _instance = null;
let _vault = null;

class Esper {
  constructor() {
    if (!_instance) {
      _vault = {
        name: '',
        version: 1,
        store: new EsperStore(),
        encryption: new EsperEncryption(),
        schema: {},
        options: {},
        collection: {},
        error: null,
        state: Esper.State.INIT
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
    return _vault.state === Esper.State.INIT;
  }
  get isReady() {
    return _vault.state === Esper.State.READY;
  }
  name(val) {
    if (!_vault.error) {
      if (typeof val === 'string' && val) {
        if (this.isInit) {
          _vault.name = val;
        } else {
          _vault.error = EsperError.immutableReadyState();
        }
      } else {
        _vault.error = EsperError.invalidParams(`esper.name(${val})`);
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
          _vault.error = EsperError.immutableReadyState();
        }
      } else {
        _vault.error = EsperError.invalidParams(`esper.version(${val})`);
      }
    }
    return this;
  }
  store(val) {
    if (!_vault.error) {
      if (val instanceof EsperStore) {
        if (this.isInit) {
          _vault.store = val;
        } else {
          _vault.error = EsperError.immutableReadyState();
        }
      } else {
        _vault.error = EsperError.invalidParams(`esper.store(${val})`);
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
          _vault.error = EsperError.immutableReadyState();
        }
      } else {
        _vault.error = EsperError.invalidParams(`esper.config(${val})`);
      }
    }
    return this;
  }
  encryption(val) {
    if (!_vault.error) {
      if (val instanceof EsperEncryption) {
        if (this.isInit) {
          _vault.encryption = val;
        } else {
          _vault.error = EsperError.immutableReadyState();
        }
      } else {
        _vault.error = EsperError.invalidParams(`esper.encryption(${val})`);
      }
    }
    return this;
  }
  schema(val) {
    if (!_vault.error) {
      const { name, model, key, indexes = [], migrate = null } = val;
      if (typeof name === 'string' && name
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
          _vault.error = EsperError.immutableReadyState();
        }
      } else {
        _vault.error = EsperError.invalidParams(`esper.schema(${val})`);
      }
    }
    return this;
  }
  async build() {
    if (!_vault.error) {
      try {
        const { name, version, store, schema } = _vault;
        await store.init();

        let metadata = await store.getItem(ESPER_METADATA_KEY);
        let oldVersion = null;
        let versionUpgraded = false;
        if (metadata && metadata.version !== version) {
          oldVersion = metadata.version;
          versionUpgraded = true;
        }

        for (let name in schema) {
          const collectionStoreKey = `${ESPER_COLLECTION_PREFIX}${name}`;
          const { key, indexes, migrate } = schema[name];

          /// create index for primary key
          let hasDefaultIndex = false;
          for (let i in indexes) {
            const index = indexes[i];
            if (index.length === 1 && index[0] === key) {
              hasDefaultIndex = true;
              break;
            }
          }
          if (!hasDefaultIndex) {
            indexes.unshift([key]);
          }

          const collectionInfo = await store.getItem(collectionStoreKey);
          const collection = new EsperCollection({
            name,
            key: collectionInfo ? collectionInfo.key : key,
            indexes: collectionInfo ? collectionInfo.indexes : indexes,
            store
          });
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
            }
          }
          await store.setItem(collectionStoreKey, { name, key, indexes });
          _vault.collection[name] = collection;
        }
        // set metadata
        await store.setItem(ESPER_METADATA_KEY, JSON.stringify({ name, version, schema }));
      } catch (e) {
        EsperLog.error(e.message);
      }
    } else {
      EsperLog.error(_vault.error.message);
    }
  }
  collection(name) {
    let col = null;
    if (!_vault.error) {
      if (this.isReady) {
        if (typeof name === 'string'
          && _vault.collection.hasOwnProperty(name)
          && _vault.collection[name] instanceof EsperCollection) {
          col = _vault.collection[name];
        } else {
          EsperLog.error(EsperError.invalidParams(`esper.collection(${name})`));
        }
      } else {
        EsperLog.error(EsperError.databaseNotReady());
      }
    }
    return col;
  }
}

export {
  EsperQuery,
  EsperError,
  EsperStore,
  EsperEncryption
};
export default new Esper();