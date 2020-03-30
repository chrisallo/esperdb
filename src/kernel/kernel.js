
/// default options
const DEFAULT_BLOCK_SIZE = 64;
const DEFAULT_BATCH_SIZE = 128;
const DEFAULT_BATCH_INTERVAL = 200;

export default class EsperKernel {
  constructor({
    name = '',
    store = null,
    encryption = null,
    options = {}
  }) {
    this.name = name;
    this.store = store;
    this.encryption = encryption;
    this.config = {
      blockSize: options.blockSize || DEFAULT_BLOCK_SIZE,
      batchSize: options.batchSize || DEFAULT_BATCH_SIZE,
      batchInterval: options.batchInterval || DEFAULT_BATCH_INTERVAL
    };
  }
  get(collectionName, key) { // object
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  getAll(collectionName) { // array<{ key: string, value: object }>
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  each(collectionName, iterator) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  count(collectionName) { // number
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  set(collectionName, key, item) { // object
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  remove(collectionName, key) { // object
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  clear(collectionName) { // void
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
}