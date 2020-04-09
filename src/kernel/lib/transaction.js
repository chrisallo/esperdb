import EsperMutex from "../../utils/mutex";

const DEFAULT_BATCH_DURATION = 200;
const TRANSACTION_PREFIX = 'esper-trns-';

class EsperTransactionJob {
  constructor({ action, key, data }) {
    this.action = action;
    this.key = key;
    this.data = data;
  }
}
class EsperTransaction {
  constructor({ name, store, encryption }) {
    this.name = name;
    this.store = store;
    this.encryption = encryption;

    this.mutex = new EsperMutex();
    this.jobs = [];

    this.batchTimer = null;
    this.batchDuration = DEFAULT_BATCH_DURATION;
  }
  static get Action() {
    return { PUT, REMOVE };
  }
  get backupKey() {
    return `${TRANSACTION_PREFIX}${this.name}`;
  }
  init() {
    this.start();
    this.mutex.lock(async unlock => {
      const rawBackup = await this.store.getItem(this.backupKey);
      if (rawBackup) {
        const jobs = JSON.parse(this.encryption.decrypt(rawBackup));
        this.jobs = jobs.map(job => new EsperTransactionJob(job));
      }
      unlock();
      this.end();
    });
  }
  addJob(action, key, data) {
    this.start();
    this.mutex.lock(async unlock => {
      this.jobs.push(new EsperTransactionJob({ action, key, data }));
      unlock();
    });
  }
  flush() {
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.mutex.lock(async unlock => {
          const backup = this.encryption.encrypt(JSON.stringify(this.jobs));
          await this.store.setItem(this.backupKey, backup);
          await Promise.all(this.jobs.map(job => {
            return async () => {
              switch (job.action) {
                case EsperTransaction.Action.PUT: {
                  const encryptedData = this.encryption.encrypt(JSON.stringify(job.data));
                  await this.store.setItem(job.key, encryptedData);
                  break;
                }
                case EsperTransaction.Action.REMOVE: {
                  await this.store.removeItem(job.key);
                  break;
                }
              }
            };
          }));
          await this.store.removeItem(this.backupKey);
          this.jobs = [];
          this.batchTimer = null;
          unlock();
        });
      }, this.batchDuration);
    }
  }
}

export default EsperTransaction;