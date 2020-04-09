
import libBtreeTest from './lib/btree';
import libIndexerTest from './lib/indexer';
import libTransactionTest from './lib/transaction';

export default function () {
  describe('kernel', function () {
    libBtreeTest();
    libIndexerTest();
    libTransactionTest();
  });
}