
export default class EsdbLog {
  static log(...messages) {
    // eslint-disable-next-line no-console
    console.log(...messages);
  }
  static warning(...messages) {
    // eslint-disable-next-line no-console
    console.warning(...messages);
  }
  static error(...messages) {
    // eslint-disable-next-line no-console
    console.error(...messages);
  }
}