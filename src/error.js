
export default class EsdbError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
  static immutableReadyState() {
    return new EsdbError(`Can't change database after getting ready.`, 700010);
  }
  static databaseNotReady() {
    return new EsdbError(`Database is not ready.`, 700011);
  }
  static invalidParams(element = 'unknown') {
    return new EsdbError(`Invalid parameters: ${element}`, 703000);
  }
}