
export default class EsdbLog {
  static log(...messages) {
    console.log(...messages);
  }
  static warning(...messages) {
    console.warning(...messages);
  }
  static error(...messages) {
    console.error(...messages);
  }
}