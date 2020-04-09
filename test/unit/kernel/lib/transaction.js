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
  });
};