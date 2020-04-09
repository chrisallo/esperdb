import config from '../../../config';
import EsperStore from '../../../../src/interface/store';
import EsperEncryption from '../../../../src/interface/encryption';
import EsperTransaction from '../../../../src/kernel/lib/transaction';

export default function () {
  describe('transaction', function () {
    this.timeout(config.timeout);

    const store = new EsperStore(100);
    const encryption = new EsperEncryption();
    const transaction = new EsperTransaction({ name: 'test', store, encryption });

    before(async function () {
      await transaction.init();
    });
    afterEach(async function () {
      transaction.reset();
      await store.clearAllItems();
    });
    it('addJob', async function () {
      transaction.addJob(EsperTransaction.Action.PUT, 'key', 'test data');
      const backup = JSON.parse(await store.getItem(transaction.backupKey));
      const data = JSON.parse(await store.getItem('key'));
      assert.isTrue(backup === null || backup === '[]');
      assert.isNull(data);
    });
    it('addJob > flush', async function () {
      transaction.addJob(EsperTransaction.Action.PUT, 'key', 'test data');
      await transaction.flush();

      const backup = JSON.parse(await store.getItem(transaction.backupKey));
      const data = JSON.parse(await store.getItem('key'));
      assert.isTrue(backup === null || backup === '[]');
      assert.equal(data, 'test data');
    });
    it('addJob x3 > flush', async function () {
      transaction.addJob(EsperTransaction.Action.PUT, 'key1', 'test data 1');
      transaction.addJob(EsperTransaction.Action.PUT, 'key2', 'test data 2');
      transaction.addJob(EsperTransaction.Action.REMOVE, 'key1');
      await transaction.flush();

      const backup = JSON.parse(await store.getItem(transaction.backupKey));
      const data1 = JSON.parse(await store.getItem('key1'));
      const data2 = JSON.parse(await store.getItem('key2'));
      assert.isTrue(backup === null || backup === '[]');
      assert.isNull(data1);
      assert.equal(data2, 'test data 2');
    });
    it('addJob x2 > flush > addJob x2 > flush', async function () {
      transaction.addJob(EsperTransaction.Action.PUT, 'key1', 'test data 1');
      transaction.addJob(EsperTransaction.Action.PUT, 'key2', 'test data 2');
      await transaction.flush();

      transaction.addJob(EsperTransaction.Action.PUT, 'key3', 'test data 3');
      transaction.addJob(EsperTransaction.Action.REMOVE, 'key1');
      await transaction.flush();

      const backup = JSON.parse(await store.getItem(transaction.backupKey));
      const data1 = JSON.parse(await store.getItem('key1'));
      const data2 = JSON.parse(await store.getItem('key2'));
      const data3 = JSON.parse(await store.getItem('key3'));
      assert.isTrue(backup === null || backup === '[]');
      assert.isNull(data1);
      assert.equal(data2, 'test data 2');
      assert.equal(data3, 'test data 3');
    });
  });
};