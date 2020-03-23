import EsdbLog from "./utils/log";
import { EsdbError } from "./esdb";

const _match = (item, conditions) => {
  try {
    for (let key in conditions) {
      if (key === EsdbQuery.Command.AND) {
        if (Array.isArray(conditions[key])) {
          for (let i in conditions[key]) {
            if (!_match(item, conditions[key][i])) {
              return false;
            }
          }
        } else {
          throw EsdbError.invalidParams(`Query syntax error with ${key}`);
        }
      } else if (key === EsdbQuery.Command.OR) {
        if (Array.isArray(conditions[key])) {
          let count = 0;
          for (let i in conditions[key]) {
            if (_match(item, conditions[key][i])) {
              count++;
            }
          }
          if (count === 0) return false;
        } else {
          throw EsdbError.invalidParams(`Query syntax error with ${key}`);
        }
      } else {
        const filter = conditions[key];
        if (typeof filter === 'object' && filter) {
          // command
          for (let op in filter) {
            switch (op) {
              case EsdbQuery.Command.GT: {
                if (typeof item[key] === 'number') {
                  if (!(item[key] > filter[op])) {
                    return false;
                  }
                } else if (typeof item[key] === 'string') {
                  if (!(item[key].localeCompare(filter[op]) > 0)) {
                    return false;
                  }
                } else {
                  return false;
                }
                break;
              }
              case EsdbQuery.Command.GTE: {
                if (typeof item[key] === 'number') {
                  if (!(item[key] >= filter[op])) {
                    return false;
                  }
                } else if (typeof item[key] === 'string') {
                  if (!(item[key].localeCompare(filter[op]) >= 0)) {
                    return false;
                  }
                } else {
                  return false;
                }
                break;
              }
              case EsdbQuery.Command.LT: {
                if (typeof item[key] === 'number') {
                  if (!(item[key] < filter[op])) {
                    return false;
                  }
                } else if (typeof item[key] === 'string') {
                  if (!(item[key].localeCompare(filter[op]) < 0)) {
                    return false;
                  }
                } else {
                  return false;
                }
                break;
              }
              case EsdbQuery.Command.LTE: {
                if (typeof item[key] === 'number') {
                  if (!(item[key] <= filter[op])) {
                    return false;
                  }
                } else if (typeof item[key] === 'string') {
                  if (!(item[key].localeCompare(filter[op]) <= 0)) {
                    return false;
                  }
                } else {
                  return false;
                }
                break;
              }
              case EsdbQuery.Command.EQ: {
                if (!(item[key] === filter[op])) {
                  return false;
                }
                break;
              }
              case EsdbQuery.Command.NEQ: {
                if (!(item[key] !== filter[op])) {
                  return false;
                }
                break;
              }
              case EsdbQuery.Command.IN: {
                if (Array.isArray(filter[op])) {
                  if (!(filter[op].indexOf(item[key]) >= 0)) {
                    return false;
                  }
                } else {
                  throw EsdbError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsdbQuery.Command.NOT_IN: {
                if (Array.isArray(filter[op])) {
                  if (!(filter[op].indexOf(item[key]) < 0)) {
                    return false;
                  }
                } else {
                  throw EsdbError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsdbQuery.Command.LIKE: {
                if (typeof filter[op] === 'string') {
                  if (!(filter[op].indexOf(item[key]) >= 0)) {
                    return false;
                  }
                } else {
                  throw EsdbError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsdbQuery.Command.NOT_LIKE: {
                if (typeof filter[op] === 'string') {
                  if (!(filter[op].indexOf(item[key]) < 0)) {
                    return false;
                  }
                } else {
                  throw EsdbError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsdbQuery.Command.REGEX: {
                if (filter[op] instanceof RegExp) {
                  if (!filter[op].test(item[key])) {
                    return false;
                  }
                } else {
                  throw EsdbError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsdbQuery.Command.WHERE: {
                if (typeof filter[op] === 'function') {
                  if (!filter[op](item[key])) {
                    return false;
                  }
                } else {
                  throw EsdbError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              default:
                return false;
            }
          }
        } else {
          // primitive value
          if (item[key] !== filter) {
            return false;
          }
        }
      }
    }
    return true;
  } catch (err) {
    EsdbLog.error(err.message);
    return false;
  }
};

export default class EsdbQuery {
  constructor(cond) {
    this.conditions = cond;
  }
  static get Command() {
    return {
      AND: '/and',
      OR: '/or',
      GT: '>',
      GTE: '>=',
      LT: '<',
      LTE: '<=',
      EQ: '=',
      NEQ: '!=',
      IN: '/in',
      NOT_IN: '/nin',
      LIKE: '/like',
      NOT_LIKE: '/nlike',
      REGEX: '/regex',
      WHERE: '/where'
    };
  }
  getRelatedColumns() {
    const columns = [];
    for (let key in this.conditions) {
      if ([EsdbQuery.Command.AND, EsdbQuery.Command.OR].indexOf(key)) {
        if (Array.isArray(this.conditions[key])) {
          const stack = [];
          // TODO:
        }
      } else {
        columns.push(key);
      }
    }
    return columns;
  }
  match(item) {
    return _match(item, this.conditions);
  }
}