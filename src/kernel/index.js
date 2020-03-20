
/// default options
const DEFAULT_BLOCK_SIZE = 64;
const DEFAULT_BATCH_SIZE = 128;
const DEFAULT_BATCH_INTERVAL = 200;

export default class EsdbKernel {
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
  get(collection, key) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  set(collection, key, item) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  remove(collection, key) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
  clear(collection) {
    return new Promise((resolve, reject) => {
      // TODO:
    });
  }
}