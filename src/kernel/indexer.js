import EsperQuery from "../query";

export default class EsperIndexer {
  constructor({
    collectionName = '',
    kernel = null,
    indexes = []
  }) {
    this.collectionName = collectionName;
    this.kernel = kernel;
    this.indexes = indexes;
  }
  indexToKey(index) {
    return index.join('>');
  }
  indexFromKey(key) {
    return key.split('>');
  }
  findBestIndexForQuery(query, options = {}) {
    if (query instanceof EsperQuery && typeof options === 'object' && options !== null) {
      const relatedColumns = query.getRelatedColumns();
      let candidates = [];
      for (let i in this.indexes) {
        const indexedColumns = this.indexes[i].map(item => item.replace(/^--/, ''));
        let score = 0;
        let weight = 1.0;
        for (let j in indexedColumns) {
          const indexedColumn = indexedColumns[j];
          if (relatedColumns.indexOf(indexedColumn) >= 0) {
            score += weight;
          } else {
            weight *= 0.2;
          }
        }
        if (indexedColumns.length > 0 && indexedColumns[indexedColumns.length - 1] === options.orderBy) {
          weight += 2 * Math.sqrt(indexedColumns.length) / indexedColumns.length;
        }
        if (score > 0) {
          candidates.push({ index: this.indexes[i], score });
        }
      }
      const ranking = candidates.sort((a, b) => b.score - a.score);
      return ranking.length > 0 ? ranking[0] : null;
    } else {
      return null;
    }
  }
  async replace(newIndexes) {
    const addedIndexKeys = [];
    const removedIndexKeys = [];

    const compareKey = (a, b) => a.localeCompare(b);
    const currentIndexKeys = this.indexes.map(idx => this.indexToKey(idx)).sort(compareKey);
    const newIndexKeys = newIndexes.map(idx => this.indexToKey(idx)).sort(compareKey);

    let currentIndexCursor = 0;
    let newIndexCursor = 0;
    while (currentIndexCursor < currentIndexKeys.length || newIndexCursor < newIndexKeys.length) {
      const currentIndexKey = currentIndexKeys[currentIndexCursor] || null;
      const newIndexKey = newIndexKeys[newIndexCursor] || null;
      if (currentIndexKey && newIndexKey) {
        const compared = compareKey(currentIndexKey, newIndexKey);
        if (compared === 0) { // equal > skip
          currentIndexCursor++;
          newIndexCursor++;
        } else if (compared > 0) { // current is greater than new > add new
          addedIndexKeys.push(newIndexKey);
          newIndexCursor++;
        } else { // new is greater than current > remove current
          removedIndexKeys.push(currentIndexKey);
          currentIndexCursor++;
        }
      } else if (currentIndexKey) { // current is spare > remove current
        removedIndexKeys.push(currentIndexKey);
        currentIndexCursor++;
      } else if (newIndexKey) { // new is spare > add new
        addedIndexKeys.push(newIndexKey);
        newIndexCursor++;
      }
    }

    // TODO:
    // for (let i in addedIndexKeys) {
    //   const index = this.indexFromKey(addedIndexKeys[i]);
    //   const data = await this.kernel.getAll(this.collectionName);
    //   const indexTable = data
    //     .sort((a, b) => {
    //       // TODO: sort data by the index
    //     })
    //     .map(item => item.key);

    //   // TODO: save indextable
    // }
    // for (let i in removedIndexKeys) {
    //   const index = this.indexFromKey(removedIndexKeys[i]);
    //   // TODO: remove index data
    // }
    this.indexes = newIndexes;
  }
}