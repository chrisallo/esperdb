(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function encryptionTest () {
    describe('encryption', function () {
      it('sample', function () {//
      });
    });
  }

  function storeTest () {
    describe('store', function () {});
  }

  function interfaceTest () {
    describe('interface', function () {
      encryptionTest();
      storeTest();
    });
  }

  function kernelTest () {
    describe('kernel test', function () {// TODO:
    });
  }

  function utilsTest () {
    describe('utils test', function () {// TODO:
    });
  }

  describe('esdb test', function () {
    describe('unit test', function () {
      interfaceTest();
      kernelTest();
      utilsTest();
    });
  });

})));
