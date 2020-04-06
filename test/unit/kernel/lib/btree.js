
import Btree from '../../../../src/kernel/lib/btree';

export default function () {
  describe('btree', function () {
    const ADD_COUNT = 50000;
    const UPDATE_COUNT = 10000;
    const REMOVE_COUNT = 12000;

    let bt = null;

    const range = 10000000;
    const data = [];
    for (let i = 0; i < ADD_COUNT; i++) {
      const n = parseInt(range * Math.random()) % range;
      if (!data.includes(n))
        data.push(n);
    }
    const updated = [];
    for (let i = 0; i < UPDATE_COUNT; i++) {
      const idx = parseInt((data.length - 1) * Math.random());
      if (!updated.includes(data[idx]))
        updated.push(data[idx]);
    }
    const removed = [];
    for (let i = 0; i < REMOVE_COUNT; i++) {
      const idx = parseInt((data.length - 1) * Math.random());
      if (!removed.includes(data[idx]))
        removed.push(data[idx]);
    }
    const remained = [];
    for (let i in data) {
      if (!removed.includes(data[i])) {
        remained.push(data[i]);
      }
    }

    before(function (done) {
      bt = new Btree({ order: 50 });
      done();
    });
    beforeEach(function (done) {
      bt.clear();
      done();
    });
    it('add', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const list = [];
      bt.iterate((n, i) => {
        list.push(n);
      });
      assert.sameMembers(data, list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > update', function (done) {
      data.forEach(v => {
        bt.add(v);
      });
      updated.forEach(v => {
        bt.add(v);
      });

      const list = [];
      bt.iterate((n, i) => {
        list.push(n);
      });
      assert.sameMembers(data, list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > remove', function (done) {
      data.forEach(v => {
        bt.add(v);
      });
      removed.forEach(v => {
        bt.remove(v);
      });

      const list = [];
      bt.iterate((n, i) => {
        list.push(n);
      });
      assert.sameMembers(remained, list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > remove > re-add', function (done) {
      data.forEach(v => {
        bt.add(v);
      });
      removed.forEach(v => {
        bt.remove(v);
      });
      removed.forEach(v => {
        bt.add(v);
      });

      const list = [];
      bt.iterate((n, i) => {
        list.push(n);
      });
      assert.sameMembers(data, list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
  });
}