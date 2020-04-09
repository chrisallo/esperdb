import config from '../../../config';
import EsperIndexer from '../../../../src/kernel/lib/indexer';

export default function () {
  const DATA_COUNT = 100;
  const RANGE = 20;

  let indexer = null;

  describe('indexer', function () {
    this.timeout(config.timeout);

    const data = [];
    let seed = 0;
    for (let i = 0; i < DATA_COUNT; i++) {
      const a = parseInt(RANGE * Math.random()) % RANGE;
      const b = parseInt(RANGE * Math.random()) % RANGE;
      const x = { pk: `k_${++seed}`, a, b };
      data.push(x);
    }
    const sorted = [...data].sort((x, y) => {
      return x.a === y.a ? y.b - x.b : x.a - y.a;
    });

    before(function () {
      indexer = new EsperIndexer({
        collectionName: 'TestCollection',
        primaryKey: 'pk',
        columns: ['a', '--b']
      });
    });
    afterEach(function () {
      indexer.clear();
    });

    it('put > iterate', function () {
      data.forEach(v => {
        indexer.put(v);
      });

      const index = sorted.map(x => x.pk).indexOf(data[0].pk);
      const list = [];
      indexer.iterate(data[0], null, item => {
        list.push(item);
      });
      assert.sameOrderedMembers(
        list.map(x => x.pk),
        sorted.slice(index).map(x => x.pk)
      );
    });
    it('put > iterate limit', function () {
      data.forEach(v => {
        indexer.put(v);
      });

      const index = sorted.map(x => x.pk).indexOf(data[0].pk);
      const limit = 5;
      const list = [];
      indexer.iterate(data[0], { limit }, item => {
        list.push(item);
      });
      assert.sameOrderedMembers(
        list.map(x => x.pk),
        sorted.slice(index, index + limit).map(x => x.pk)
      );
    });
    it('put > iterate skip limit', function () {
      data.forEach(v => {
        indexer.put(v);
      });

      const index = sorted.map(x => x.pk).indexOf(data[0].pk);
      const skip = 3;
      const limit = 5;
      const list = [];
      indexer.iterate({ a: data[0].a, b: data[0].b }, { skip, limit }, item => {
        list.push(item);
      });
      assert.sameOrderedMembers(
        list.map(x => x.pk),
        sorted.slice(index + skip, index + limit + skip).map(x => x.pk)
      );
    });
    it('put > replace > search old', function () {
      data.forEach(v => {
        indexer.put(v);
      });
      const newData = {
        pk: data[0].pk,
        a: data[0].a + 1,
        b: data[0].b + 1
      };
      indexer.replace(data[0], newData);
      indexer.iterate(data[0], null, item => {
        if (item.pk === newData.pk) {
          assert.notEqual(item.a, data[0].a);
          assert.notEqual(item.b, data[0].b);
          assert.equal(item.a, newData.a);
          assert.equal(item.b, newData.b);
          return false;
        }
      });
    });
    it('put > replace > search new', function () {
      data.forEach(v => {
        indexer.put(v);
      });
      const newData = {
        pk: data[0].pk,
        a: data[0].a + 1,
        b: data[0].b + 1
      };
      indexer.replace(data[0], newData);
      indexer.iterate(newData, null, item => {
        if (item.pk === data[0].pk) {
          assert.notEqual(item.a, data[0].a);
          assert.notEqual(item.b, data[0].b);
          assert.equal(item.a, newData.a);
          assert.equal(item.b, newData.b);
          return false;
        }
      });
    });
    it('put > remove > search', function () {
      data.forEach(v => {
        indexer.put(v);
      });
      indexer.remove(data[0]);
      indexer.iterate(data[0], null, item => {
        assert.isFalse(item.pk === data[0].pk);
      });
    });
    it('put > clear > search', function () {
      data.forEach(v => {
        indexer.put(v);
      });
      indexer.clear();
      indexer.iterate(data[0], null, item => {
        assert.isFalse(item.pk === data[0].pk);
      });
    });
  });
}
