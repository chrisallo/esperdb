
import interfaceTest from './unit/interface';
import kernelTest from './unit/kernel';
import utilsTest from './unit/utils';

describe('esdb test', function () {
  describe('unit test', function () {
    interfaceTest();
    kernelTest();
    utilsTest();
  });
});