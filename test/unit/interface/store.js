import config from "../../config";
import EsperStore from "../../../src/interface/store";

export default function () {
  describe('store', function () {
    this.timeout(config.timeout);

    let store = null;
    before(async function () {
      store = new EsperStore(100);
      await store.init();
    });
    afterEach(async function () {
      await store.clearAllItems();
    });

    it('set > get', async function () {
      const value = 'value';
      await store.setItem('key', value);

      const data = await store.getItem('key');
      assert.equal(value, data);
    });
    it('set > set same > get', async function () {
      const value1 = 'value1';
      const value2 = 'value2';
      await store.setItem('key1', value1);
      await store.setItem('key1', value2);

      const data = await store.getItem('key1');
      assert.equal(value2, data);
    });
    it('set > set diff > get', async function () {
      const value1 = 'value1';
      const value2 = 'value2';
      await store.setItem('key1', value1);
      await store.setItem('key2', value2);

      const data1 = await store.getItem('key1');
      const data2 = await store.getItem('key2');
      assert.equal(value1, data1);
      assert.equal(value2, data2);
    });
    it('set > remove > get', async function () {
      const value = 'value';
      await store.setItem('key', value);
      await store.removeItem('key');

      const data = await store.getItem('key');
      assert.isNull(data);
    });
  });
}