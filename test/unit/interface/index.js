import encryptionTest from './encryption';
import storeTest from './store';

export default function () {
  describe('interface', function () {
    encryptionTest();
    storeTest();
  });
}