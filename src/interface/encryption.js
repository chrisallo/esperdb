
export default class EsperEncryption {
  encrypt(doc) {
    return JSON.stringify(doc);
  }
  decrypt(cipher) {
    return JSON.parse(cipher);
  }
}