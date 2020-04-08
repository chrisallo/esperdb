import config from '../../../config';
import EsperIndexer from '../../../../src/kernel/lib/indexer';

export default function () {
  const DATA_COUNT = 100;
  const RANGE = 20;

  let indexer = null;

  describe('indexer', function () {
    this.timeout(config.timeout);

    let seed = 0;
    const data = [];
    for (let i = 0; i < DATA_COUNT; i++) {
      const a = parseInt(RANGE * Math.random()) % RANGE;
      const b = parseInt(RANGE * Math.random()) % RANGE;
      const x = { pk: `k_${++seed}`, a, b };
      data.push(x);
    }
    const sorted = [...data].sort((x, y) => {
      return (x.a === y.a) ? y.b - x.b : x.a - y.a;
    });

    before(function (done) {
      indexer = new EsperIndexer({
        collectionName: 'TestCollection',
        primaryKey: 'pk',
        columns: ['a', '--b']
      });
      done();
    });
    after(function (done) {
      indexer.clear();
      done();
    });

    it('put > search', function (done) {
      data.forEach(v => {
        indexer.put(v);
      });

      const item = indexer.search(data[0]);
      assert.isNotNull(item);
      assert.equal(item.pk, data[0].pk);
      assert.equal(item.a, data[0].a);
      assert.equal(item.b, data[0].b);
      done();
    });
    it('put > iterate', function (done) {
      data.forEach(v => {
        indexer.put(v);
      });

      const index = sorted.map(x => x.pk).indexOf(data[0].pk);
      const list = indexer.iterate({
        a: data[0].a,
        b: data[0].b
      });
      assert.sameOrderedMembers(
        list.map(x => x.pk),
        sorted.slice(index).map(x => x.pk)
      );
      done();
    });
    it('put > iterate limit', function (done) {
      data.forEach(v => {
        indexer.put(v);
      });

      const index = sorted.map(x => x.pk).indexOf(data[0].pk);
      const limit = 5;
      const list = indexer.iterate({
        a: data[0].a,
        b: data[0].b
      }, limit);
      assert.sameOrderedMembers(
        list.map(x => x.pk),
        sorted.slice(index, index + limit).map(x => x.pk)
      );
      done();
    });
    it('put > replace > search old', function (done) {
      data.forEach(v => {
        indexer.put(v);
      });
      const newData = {
        pk: data[0].pk,
        a: parseInt(RANGE * Math.random()) % RANGE,
        b: parseInt(RANGE * Math.random()) % RANGE
      };
      indexer.replace(data[0], newData);

      const item = indexer.search(data[0]);
      assert.isNull(item);
      done();
    });
    it.only('put > replace > search new', function (done) {
      data.forEach(v => {
        indexer.put(v);
      });
      const newData = {
        pk: data[0].pk,
        a: parseInt(RANGE * Math.random()) % RANGE,
        b: parseInt(RANGE * Math.random()) % RANGE
      };
      indexer.replace(data[0], newData);

      const item = indexer.search(newData);
      assert.isNotNull(item);
      assert.equal(item.pk, newData.pk);
      assert.equal(item.a, newData.a);
      assert.equal(item.b, newData.b);
      done();
    });
    it('put > remove > search', function (done) {
      data.forEach(v => {
        indexer.put(v);
      });
      indexer.remove(data[0]);

      const item = indexer.search(data[0]);
      assert.isNull(item);
      done();
    });
    it('put > clear > search', function (done) {
      data.forEach(v => {
        indexer.put(v);
      });
      indexer.clear();

      const item = indexer.search(data[0]);
      assert.isNull(item);
      done();
    });
  });
}