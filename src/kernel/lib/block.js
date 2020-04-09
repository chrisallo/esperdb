
export default class EsperBlock {
  constructor({
    blockKey,
    serializedData = null
  }) {
    this.key = blockKey;
    this.data = {};
    if (serializedData) {
      this.data = JSON.parse(serializedData);
    }
  }
  static createKey(label, index = 0) {
    return `${label.toLowerCase()}-blk-${index}`;
  }
  get count() {
    return Object.keys(this.data).length;
  }
  serialize() {
    const stringified = JSON.stringify(this.data);
    return stringified;
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