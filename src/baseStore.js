
let _memoryCache = {};

export default class EsdbBaseStore {
  init() {
    return Promise.resolve();
  }
  getItem(key) {
    return new Promise((resolve, _) => {
      resolve(_memoryCache[key] || null);
    });
  }
  setItem(key, item) {
    return new Promise((resolve, _) => {
      _memoryCache[key] = item;
      resolve(item);
    });
  }
  removeItem(key) {
    return new Promise((resolve, _) => {
      let item = null;
      if (_memoryCache.hasOwnProperty(key)) {
        item = _memoryCache[key];
        delete _memoryCache[key];
      }
      resolve(item);
    });
  }
  clearAllItems() {
    return new Promise((resolve, _) => {
      _memoryCache = {};
      resolve();
    });
  }
}