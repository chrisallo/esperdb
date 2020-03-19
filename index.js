
import Esdb from './src/esdb';
import EsdbQuery from './src/query';
import EsdbError from './src/error';
import EsdbBaseStore from './src/baseStore';
import EsdbEncryption from './src/encryption';

export {
  EsdbQuery,
  EsdbError,
  EsdbBaseStore,
  EsdbEncryption
};
export default new Esdb();