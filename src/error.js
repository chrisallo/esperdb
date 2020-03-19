
export default class EsdbError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
  static invalidParams(element = 'unknown') {
    return new EsdbError(`Invalid parameters: ${element}`, 703000);
  }
}