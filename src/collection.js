import { EsdbError } from "./esdb";
import EsdbMutex from "./utils/mutex";

const _kernel = new WeakMap();
const _mutex = new WeakMap();

export default class EsdbCollection {
  constructor({
    name = '',
    key = '',
    kernel = null
  }) {
    this.name = name;
    this.key = key;
    _kernel.set(this, kernel);
    _mutex.set(this, new EsdbMutex());
  }
  get(key) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(async unlock => {
          try {
            const item = await kernel.get(this, key);
            unlock();
            resolve(item);
          } catch (e) {
            unlock();
            reject(e);
          }
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  getAll(where) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(async unlock => {
          // TODO:
          unlock();
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  count(where) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(async unlock => {
          // TODO:
          unlock();
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  insert(doc) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(async unlock => {
          // TODO:
          unlock();
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  upsert(doc) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(async unlock => {
          try {
            const item = await kernel.set(this, doc[this.key], doc);
            unlock();
            resolve(item);
          } catch (e) {
            unlock();
            reject(e);
          }
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  update(doc) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(unlock => {
          // TODO:
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  remove(key) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(unlock => {
          try {
            const item = await kernel.remove(this, key);
            unlock();
            resolve(item);
          } catch (e) {
            unlock();
            reject(e);
          }
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }

  updateIf(setter, where) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(unlock => {
          // TODO:
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  removeIf(where) {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(unlock => {
          // TODO:
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
  clear() {
    return new Promise((resolve, reject) => {
      const kernel = _kernel.get(this);
      if (kernel) {
        const mutex = _mutex.get(this);
        mutex.lock(unlock => {
          try {
            await kernel.clear(this);
            unlock();
            resolve();
          } catch (e) {
            unlock();
            reject(e);
          }
        });
      } else {
        reject(EsdbError.kernelNotLoaded());
      }
    });
  }
}