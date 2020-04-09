import config from "../../config";
import EsperEncryption from "../../../src/interface/encryption";

export default function () {
  describe('encryption', function () {
    this.timeout(config.timeout);

    const encryption = new EsperEncryption();
    const data = 'hello world';

    it('encrypt default', async function () {
      const encrypted = await encryption.encrypt(data);
      assert.equal(encrypted, 'hello world');
    });
    it('decrypt default', async function () {
      const encrypted = await encryption.encrypt(data);
      const decrypted = await encryption.decrypt(encrypted);
      assert.equal(decrypted, 'hello world');
    });
  });
}