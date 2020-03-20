
const DEFAULT_MOCK_DELAY = 20;

let _memoryCache = {};

export default class EsdbStore {
  constructor(mockDelay = DEFAULT_MOCK_DELAY) {
    this.mockDelay = mockDelay;
  }
  init() {
    return Promise.resolve();
  }
  getItem(key) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(_memoryCache[key] || null);
      }, this.mockDelay);
    });
  }
  setItem(key, item) {
    return new Promise((resolve) => {
      setTimeout(() => {
        _memoryCache[key] = item;
        resolve(item);
      }, this.mockDelay);
    });
  }
  removeItem(key) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let item = null;
        if (_memoryCache.hasOwnProperty(key)) {
          item = _memoryCache[key];
          delete _memoryCache[key];
        }
        resolve(item);
      }, this.mockDelay);
    });
  }
  clearAllItems() {
    return new Promise((resolve) => {
      setTimeout(() => {
        _memoryCache = {};
        resolve();
      }, this.mockDelay);
    });
  }
}