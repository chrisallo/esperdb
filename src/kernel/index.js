
/// default options
const DEFAULT_BATCH_SIZE = 64;
const DEFAULT_BATCH_INTERVAL = 200;
const DEFAULT_BLOCK_SIZE = 64;
const DEFAULT_BLOCK_FLUSH = 16;

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
      batchSize: options.batchSize || DEFAULT_BATCH_SIZE,
      batchInterval: options.batchInterval || DEFAULT_BATCH_INTERVAL,
      blockSize: options.blockSize || DEFAULT_BLOCK_SIZE,
      blockFlush: options.blockFlush || DEFAULT_BLOCK_FLUSH
    };
  }
}