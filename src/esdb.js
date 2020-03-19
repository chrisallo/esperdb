import { EsdbBaseStore, EsdbEncryption } from '..';
import EsdbError from './error';

const vault = new WeakMap();

export default class Esdb {
  constructor() {
    vault.set(this, {
      name: '',
      version: 1,
      baseStore: EsdbBaseStore,
      encryption: EsdbEncryption,
      schema: {},
      error: null,
      state: Esdb.State.INIT
    });
  }
  static get State() {
    return {
      INIT: 'init',
      BUILT: 'built'
    };
  }
  name(val) {
    const db = vault.get(this);
    if (!db.error) {
      if (typeof val === 'string' && val) {
        db.name = val;
      } else {
        db.error = EsdbError.invalidParams(`esdb.name(${val})`);
      }
    }
    return this;
  }
  version(val) {
    const db = vault.get(this);
    if (!db.error) {
      if (typeof val === 'number' && val > 0) {
        db.version = val;
      } else {
        db.error = EsdbError.invalidParams(`esdb.version(${val})`);
      }
    }
    return this;
  }
  baseStore(val) {
    const db = vault.get(this);
    if (!db.error) {
      if (val instanceof EsdbBaseStore) {
        db.baseStore = val;
      } else {
        db.error = EsdbError.invalidParams(`esdb.baseStore(${val})`);
      }
    }
    return this;
  }
  encryption(val) {
    const db = vault.get(this);
    if (!db.error) {
      if (val instanceof EsdbEncryption) {
        db.encryption = val;
      } else {
        db.error = EsdbError.invalidParams(`esdb.encryption(${val})`);
      }
    }
    return this;
  }
  schema(val) {
    const db = vault.get(this);
    if (!db.error) {
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
        db.schema[name] = { interface, key, indexes, migrate };
      } else {
        db.error = EsdbError.invalidParams(`esdb.schema(${val})`);
      }
    }
    return this;
  }
  build() {
    const db = vault.get(this);
    return new Promise((resolve, reject) => {
      if (!db.error) {
        // TODO:
      } else {
        console.error(db.error.message);
        reject(db.error);
      }
    });
  }
}