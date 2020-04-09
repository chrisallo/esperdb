
export default class EsperEncryption {
  encrypt(doc) {
    return Promise.resolve(doc);
  }
  decrypt(cipher) {
    return Promise.resolve(cipher);
  }
}