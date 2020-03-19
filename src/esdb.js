import { EsdbBaseStore, EsdbEncryption } from '..';
import EsdbError from './error';
import EsdbCollection from './collection';
import EsdbLog from './utils/log';

/// default options
const DEFAULT_BATCH_SIZE = 64;
const DEFAULT_BATCH_INTERVAL = 200;
const DEFAULT_CACHE_BLOCK_LIMIT = 64;
const DEFAULT_CACHE_BLOCK_FLUSH = 16;

let _instance = null;
let _vault = null;

export default class Esdb {
  constructor() {
    if (!_instance) {
      _vault = {
        name: '',
        version: 1,
        baseStore: new EsdbBaseStore(),
        encryption: new EsdbEncryption(),
        schema: {},
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
  baseStore(val) {
    if (!_vault.error) {
      if (val instanceof EsdbBaseStore) {
        if (this.isInit) {
          _vault.baseStore = val;
        } else {
          _vault.error = EsdbError.immutableReadyState();
        }
      } else {
        _vault.error = EsdbError.invalidParams(`esdb.baseStore(${val})`);
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
      const { name, interface, key, indexes = [], migrate = null } = val;
      if (typeof name === 'string' && name
        && typeof interface === 'object' && interface
        && typeof key === 'string' && key
        && Array.isArray(indexes)
        && indexes.every(index =>
          Array.isArray(index)
          && index.length > 0
          && index.every(column => typeof column === 'string' && interface.hasOwnProperty(column)))
        && (typeof migrate === 'function' || migrate === null)) {
        if (this.isInit) {
          _vault.schema[name] = { interface, key, indexes, migrate };
        } else {
          _vault.error = EsdbError.immutableReadyState();
        }
      } else {
        _vault.error = EsdbError.invalidParams(`esdb.schema(${val})`);
      }
    }
    return this;
  }
  build(options = {}) {
    return new Promise((resolve, reject) => {
      if (!_vault.error) {
        const {
          batchSize = DEFAULT_BATCH_SIZE,
          batchInterval = DEFAULT_BATCH_INTERVAL,
          cacheBlockLimit = DEFAULT_CACHE_BLOCK_LIMIT,
          cacheBlockFlush = DEFAULT_CACHE_BLOCK_FLUSH
        } = options;
        // TODO:
      } else {
        EsdbLog.error(_vault.error.message);
        reject(_vault.error);
      }
    });
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