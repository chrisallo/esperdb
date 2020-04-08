
import EsperBtree from '../../../../src/kernel/lib/btree';

export default function () {
  const ADD_COUNT = 10000;
  const UPDATE_COUNT = 2500;
  const REMOVE_COUNT = 2000;
  const RANGE = 5000;

  describe('btree non-unique', function () {
    this.timeout(60000);

    let seed = 0;
    const data = [];
    for (let i = 0; i < ADD_COUNT; i++) {
      const n = parseInt(RANGE * Math.random()) % RANGE;
      const x = { k: `k_${++seed}`, n };
      data.push(x);
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
    const sorted = [...data].sort((a, b) => a.n - b.n);

    let bt = null;

    before(function (done) {
      bt = new EsperBtree({
        order: 50,
        unique: false,
        primaryKey: 'k',
        compare: (a, b) => a.n - b.n
      });
      done();
    });
    beforeEach(function (done) {
      bt.clear();
      done();
    });
    it('add > iterateAll', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateAll break', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const limit = 2000;
      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
        if (list.length === limit) return false;
      });
      assert.sameOrderedMembers(sorted.map(x => x.k).slice(0, limit), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom match top', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = 0;
      const list = [];
      bt.iterateFrom(sorted[cursor], (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });

      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match top', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = 0;
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n - 0.5 }, (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });

      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom match middle', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const middle = sorted[parseInt(sorted.length / 2)].n;
      const cursor = sorted.map(d => d.n).indexOf(middle);
      const list = [];
      bt.iterateFrom(sorted[cursor], (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match middle', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const middle = sorted[parseInt(sorted.length / 2)].n;
      const cursor = sorted.map(d => d.n).indexOf(middle);
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n - 0.5 }, (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom match bottom', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const max = sorted.reduce((a, c) => Math.max(a, c.n), 0);
      const cursor = sorted.map(d => d.n).indexOf(max);
      const list = [];
      bt.iterateFrom(sorted[cursor], (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match bottom', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const max = sorted.reduce((a, c) => Math.max(a, c.n), 0);
      const cursor = sorted.map(d => d.n).indexOf(max);
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n - 0.5 }, (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match exceed bottom', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = data.length - 1;
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n + 0.5 }, (x, i) => {
        list.push(x);
      });
      assert.sameMembers([], list);
      done();
    });
    it('add > iterateFrom match break', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = sorted.map(d => d.n).indexOf(10);
      const limit = 2000;
      const list = [];
      bt.iterateFrom(sorted[cursor], (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
        if (list.length === limit) return false;
      });
      assert.sameOrderedMembers(sorted.slice(cursor, limit + cursor).map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match break', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = sorted.map(d => d.n).indexOf(10);
      const limit = 2000;
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n - 0.5 }, (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
        if (list.length === limit) return false;
      });
      assert.sameOrderedMembers(sorted.slice(cursor, limit + cursor).map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > update > iterateAll', function (done) {
      data.forEach(v => {
        bt.put(v);
      });
      updated.forEach(v => {
        const u = { ...v, m: 'marked' };
        bt.put(u);
      });

      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });

      assert.isTrue(list
        .filter(x =>
          updated.map(i => i.k)
            .includes(x.k))
        .every(x => x.m === 'marked'));
      assert.sameOrderedMembers(sorted.map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > remove > iterateAll', function (done) {
      data.forEach(v => {
        bt.put(v);
      });
      removed.forEach(v => {
        bt.remove(v);
      });

      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameMembers(remained.map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > remove > re-add > iterateAll', function (done) {
      data.forEach(v => {
        bt.put(v);
      });
      removed.forEach(v => {
        bt.remove(v);
      });
      removed.forEach(v => {
        bt.put(v);
      });

      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameMembers(sorted.map(x => x.k), list.map(x => x.k));
      for (let i = 1; i < list.length; i++) {
        assert.isAtLeast(list[i].n, list[i - 1].n);
      }
      done();
    });
  });
  describe('btree unique', function () {
    this.timeout(60000);

    let seed = 0;
    const cache = new Set();
    const data = [];
    const uniqueData = [];
    for (let i = 0; i < ADD_COUNT; i++) {
      const n = parseInt(RANGE * Math.random()) % RANGE;
      const x = { k: `k_${++seed}`, n };
      if (!cache.has(n)) {
        cache.add(n);
        uniqueData.push(x);
      }
      data.push(x);
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
    const sorted = [...uniqueData].sort((a, b) => a.n - b.n);

    let bt = null;

    before(function (done) {
      bt = new EsperBtree({
        order: 50,
        unique: true,
        compare: (a, b) => a.n - b.n
      });
      done();
    });
    beforeEach(function (done) {
      bt.clear();
      done();
    });
    it('add > iterateAll', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateAll break', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const limit = 2000;
      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
        if (list.length === limit) return false;
      });
      assert.sameOrderedMembers(sorted.map(x => x.n).slice(0, limit), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom match top', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = 0;
      const list = [];
      bt.iterateFrom(sorted[cursor], (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });

      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match top', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = 0;
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n - 0.5 }, (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });

      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom match middle', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const middle = sorted[parseInt(sorted.length / 2)].n;
      const cursor = sorted.map(d => d.n).indexOf(middle);
      const list = [];
      bt.iterateFrom(sorted[cursor], (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match middle', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const middle = sorted[parseInt(sorted.length / 2)].n;
      const cursor = sorted.map(d => d.n).indexOf(middle);
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n - 0.5 }, (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom match bottom', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const max = sorted.reduce((a, c) => Math.max(a, c.n), 0);
      const cursor = sorted.map(d => d.n).indexOf(max);
      const list = [];
      bt.iterateFrom(sorted[cursor], (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match bottom', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const max = sorted.reduce((a, c) => Math.max(a, c.n), 0);
      const cursor = sorted.map(d => d.n).indexOf(max);
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n - 0.5 }, (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameOrderedMembers(sorted.slice(cursor).map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match exceed bottom', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const max = sorted.reduce((a, c) => Math.max(a, c.n), 0);
      const cursor = sorted.map(d => d.n).indexOf(max);
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n + 0.5 }, (x, i) => {
        list.push(x);
      });
      assert.sameMembers([], list);
      done();
    });
    it('add > iterateFrom match break', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = sorted.map(d => d.n).indexOf(10);
      const limit = 2000;
      const list = [];
      bt.iterateFrom(sorted[cursor], (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
        if (list.length === limit) return false;
      });
      assert.sameOrderedMembers(sorted.slice(cursor, limit + cursor).map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > iterateFrom not match break', function (done) {
      data.forEach(value => {
        bt.put(value);
      });

      const cursor = sorted.map(d => d.n).indexOf(10);
      const limit = 2000;
      const list = [];
      bt.iterateFrom({ n: sorted[cursor].n - 0.5 }, (x, i) => {
        assert.equal(i, list.length);
        list.push(x);
        if (list.length === limit) return false;
      });
      assert.sameOrderedMembers(sorted.slice(cursor, limit + cursor).map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > update > iterateAll', function (done) {
      data.forEach(v => {
        bt.put(v);
      });
      updated.forEach(v => {
        const u = { ...v, m: 'marked' };
        bt.put(u);
      });

      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });

      assert.isTrue(list
        .filter(x =>
          updated.map(i => i.n)
            .includes(x.n))
        .every(x => x.m === 'marked'));
      assert.sameOrderedMembers(sorted.map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > remove > iterateAll', function (done) {
      data.forEach(v => {
        bt.put(v);
      });
      removed.forEach(v => {
        bt.remove(v);
      });

      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameMembers(
        uniqueData.filter(x => !removed.map(i => i.n).includes(x.n)).map(x => x.n),
        list.map(x => x.n)
      );
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
    it('add > remove > re-add > iterateAll', function (done) {
      data.forEach(v => {
        bt.put(v);
      });
      removed.forEach(v => {
        bt.remove(v);
      });
      removed.forEach(v => {
        bt.put(v);
      });

      const list = [];
      bt.iterateAll((x, i) => {
        assert.equal(i, list.length);
        list.push(x);
      });
      assert.sameMembers(sorted.map(x => x.n), list.map(x => x.n));
      for (let i = 1; i < list.length; i++) {
        assert.isAbove(list[i].n, list[i - 1].n);
      }
      done();
    });
  });
}