
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
    const sorted = [...data].sort((a, b) => a - b);

    before(function (done) {
      bt = new Btree({ order: 50 });
      done();
    });
    beforeEach(function (done) {
      bt.clear();
      done();
    });
    it('add > iterateAll', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const list = [];
      bt.iterateAll((n, i) => {
        list.push(n);
      });
      assert.sameMembers(data, list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateAll break', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const limit = 2000;
      const list = [];
      bt.iterateAll((n, i) => {
        list.push(n);
        if (list.length === limit) return false;
      });
      assert.sameMembers(sorted.slice(0, limit), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > update > iterateAll', function (done) {
      data.forEach(v => {
        bt.add(v);
      });
      updated.forEach(v => {
        bt.add(v);
      });

      const list = [];
      bt.iterateAll((n, i) => {
        list.push(n);
      });
      assert.sameMembers(data, list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > remove > iterateAll', function (done) {
      data.forEach(v => {
        bt.add(v);
      });
      removed.forEach(v => {
        bt.remove(v);
      });

      const list = [];
      bt.iterateAll((n, i) => {
        list.push(n);
      });
      assert.sameMembers(remained, list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > remove > re-add > iterateAll', function (done) {
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
      bt.iterateAll((n, i) => {
        list.push(n);
      });
      assert.sameMembers(data, list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom match top', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = 0;
      const list = [];
      bt.iterateFrom(sorted[cursor], (n, i) => {
        list.push(n);
      });
      assert.sameMembers(sorted.slice(cursor), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom not match top', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = 0;
      const list = [];
      bt.iterateFrom(sorted[cursor] - 0.5, (n, i) => {
        list.push(n);
      });
      assert.sameMembers(sorted.slice(cursor), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom match middle', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = 20;
      const list = [];
      bt.iterateFrom(sorted[cursor], (n, i) => {
        list.push(n);
      });
      assert.sameMembers(sorted.slice(cursor), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom not match middle', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = 20;
      const list = [];
      bt.iterateFrom(sorted[cursor] - 0.5, (n, i) => {
        list.push(n);
      });
      assert.sameMembers(sorted.slice(cursor), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom match bottom', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = data.length - 1;
      const list = [];
      bt.iterateFrom(sorted[cursor], (n, i) => {
        list.push(n);
      });
      assert.sameMembers(sorted.slice(cursor), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom not match bottom', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = data.length - 1;
      const list = [];
      bt.iterateFrom(sorted[cursor] - 0.5, (n, i) => {
        list.push(n);
      });
      assert.sameMembers(sorted.slice(cursor), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom not match exceed bottom', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = data.length - 1;
      const list = [];
      bt.iterateFrom(sorted[cursor] + 0.5, (n, i) => {
        list.push(n);
      });
      assert.sameMembers([], list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom match break', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = 20;
      const limit = 2000;
      const list = [];
      bt.iterateFrom(sorted[cursor], (n, i) => {
        list.push(n);
        if (list.length === limit) return false;
      });
      assert.sameMembers(sorted.slice(cursor, limit + cursor), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
    it('add > iterateFrom not match break', function (done) {
      data.forEach(value => {
        bt.add(value);
      });

      const cursor = 20;
      const limit = 2000;
      const list = [];
      bt.iterateFrom(sorted[cursor] - 0.5, (n, i) => {
        list.push(n);
        if (list.length === limit) return false;
      });
      assert.sameMembers(sorted.slice(cursor, limit + cursor), list);
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i], list[i - 1]);
      }
      done();
    });
  });
}