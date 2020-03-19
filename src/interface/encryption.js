
export default class EsdbEncryption {
  encrypt(doc) {
    return JSON.stringify(doc);
  }
  decrypt(cipher) {
    return JSON.parse(cipher);
  }
}