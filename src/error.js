
export default class EsperError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
  static immutableReadyState() {
    return new EsperError(`Can't change database after getting ready.`, 700010);
  }
  static databaseNotReady() {
    return new EsperError(`Database is not ready.`, 700011);
  }
  static keyNotIndexed() {
    return new EsperError(`Database key is not indexed.`, 700100);
  }
  static invalidParams(element = 'unknown') {
    return new EsperError(`Invalid parameters: ${element}`, 703000);
  }
  static dataNotFound() {
    return new EsperError(`Data not found.`, 704000);
  }
  static blockNotFound() {
    return new EsperError(`Data block not found.`, 704001);
  }
  static dataAlreadyExists() {
    return new EsperError(`Data already exists.`, 709000);
  }
}