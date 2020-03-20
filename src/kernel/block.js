
export default class EsdbBlock {
  constructor(blockKey, serializedData = null) {
    this.key = blockKey;
    this.data = serializedData ? JSON.parse(serializedData) : {};
  }
  static createKey(label, index = 0) {
    return `${label.toLowerCase()}-blk-${index}`;
  }
  get count() {
    return Object.keys(this.data).length;
  }
  serialize() {
    return JSON.stringify(this.data);
  }
  get(key) {
    return this.data[key] || null;
  }
  add(key, value) {
    this.data[key] = value;
  }
  remove(key) {
    if (this.data.hasOwnProperty(key)) {
      delete this.data[key];
      return true;
    }
    return false;
  }
}