
import libBtreeTest from './lib/btree';
import libIndexerTest from './lib/indexer';

export default function () {
  describe('kernel', function () {
    libBtreeTest();
    libIndexerTest();
  });
}