import EsperLog from "./utils/log";
import EsperError from "./error";

const _match = (item, conditions) => {
  try {
    for (let key in conditions) {
      if (key === EsperQuery.Command.AND) {
        if (Array.isArray(conditions[key])) {
          for (let i in conditions[key]) {
            if (!_match(item, conditions[key][i])) {
              return false;
            }
          }
        } else {
          throw EsperError.invalidParams(`Query syntax error with ${key}`);
        }
      } else if (key === EsperQuery.Command.OR) {
        if (Array.isArray(conditions[key])) {
          let count = 0;
          for (let i in conditions[key]) {
            if (_match(item, conditions[key][i])) {
              count++;
            }
          }
          if (count === 0) return false;
        } else {
          throw EsperError.invalidParams(`Query syntax error with ${key}`);
        }
      } else {
        const filter = conditions[key];
        if (typeof filter === 'object' && filter) {
          // command
          for (let op in filter) {
            switch (op) {
              case EsperQuery.Command.GT: {
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
              case EsperQuery.Command.GTE: {
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
              case EsperQuery.Command.LT: {
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
              case EsperQuery.Command.LTE: {
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
              case EsperQuery.Command.EQ: {
                if (!(item[key] === filter[op])) {
                  return false;
                }
                break;
              }
              case EsperQuery.Command.NEQ: {
                if (!(item[key] !== filter[op])) {
                  return false;
                }
                break;
              }
              case EsperQuery.Command.IN: {
                if (Array.isArray(filter[op])) {
                  if (!(filter[op].indexOf(item[key]) >= 0)) {
                    return false;
                  }
                } else {
                  throw EsperError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsperQuery.Command.NOT_IN: {
                if (Array.isArray(filter[op])) {
                  if (!(filter[op].indexOf(item[key]) < 0)) {
                    return false;
                  }
                } else {
                  throw EsperError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsperQuery.Command.LIKE: {
                if (typeof filter[op] === 'string') {
                  if (!(filter[op].indexOf(item[key]) >= 0)) {
                    return false;
                  }
                } else {
                  throw EsperError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsperQuery.Command.NOT_LIKE: {
                if (typeof filter[op] === 'string') {
                  if (!(filter[op].indexOf(item[key]) < 0)) {
                    return false;
                  }
                } else {
                  throw EsperError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsperQuery.Command.REGEX: {
                if (filter[op] instanceof RegExp) {
                  if (!filter[op].test(item[key])) {
                    return false;
                  }
                } else {
                  throw EsperError.invalidParams(`Query syntax error with ${key}`);
                }
                break;
              }
              case EsperQuery.Command.WHERE: {
                if (typeof filter[op] === 'function') {
                  if (!filter[op](item[key])) {
                    return false;
                  }
                } else {
                  throw EsperError.invalidParams(`Query syntax error with ${key}`);
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
    EsperLog.error(err.message);
    return false;
  }
};

export default class EsperQuery {
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
      if ([EsperQuery.Command.AND, EsperQuery.Command.OR].indexOf(key)) {
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