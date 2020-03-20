
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
  static kernelNotLoaded() {
    return new EsdbError(`Database kernel is not loaded.`, 700012);
  }
  static invalidParams(element = 'unknown') {
    return new EsdbError(`Invalid parameters: ${element}`, 703000);
  }
  static dataNotFound() {
    return new EsdbError(`Data not found.`, 704000);
  }
  static dataAlreadyExists() {
    return new EsdbError(`Data already exists.`, 709000);
  }
}