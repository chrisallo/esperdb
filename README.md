# esdb

A document database wrapper for JavaScript. It wraps various key-value based database solutions and turns them into a fully-indexed, document-based database.

## Install

`esdb` is distributed through NPM.

```
~$ npm install --save esdb
```

or

```
~$ yarn install esdb
```

## Build and test

To build the source code, simply do

```
~$ npm run build
```

An automated test is ready for the stability of `esdb` which is written in `jest`.

```
~$ npm run test
```

## How to use

### Prerequisite

`esdb` uses a store with an interface that should be implemented. It wraps the key-value database so that `esdb` could use it as a storage. The interface looks like the below.

```ts
interface EsdbStore {
  init(name: string, version: number): Promise<void>;
  getItem(key: string): Promise<object>;
  setItem(key: string, item: object): Promise<object>;
  removeItem(key: string): Promise<object>;
  clearAllItems(): Promise<void>;
}
```

### Initialization

Suppose that we're going to store the product data with its price. The data model of the `Product` looks like this:

```ts
interface Product {
  id: string; // primary key
  name: string;
  price: number;
  createdAt: number;
}
```

Then we could get or create the new collection `Product` by doing this.

```js
import esdb from 'esdb';
import customStoreImplementsEsdbStore from '/your/base/path';

esdb
  .name('example.product.db')
  .version(2)
  .store(customStoreImplementsEsdbStore)
  .config(options)
  .schema({
    // collection name
    name: 'Product',

    // data model
    model: {
      id: 'string',
      name: 'string',
      price: 'number',
      createdAt: 'number'
    },

    // primary key
    key: 'id',

    // indexes (optional)
    indexes: [
      ['name', 'price'],
      ['createdAt']
    ],

    // data migration function (optional)
    migrate: (oldVersion, item) => {
      return new Promise((resolve, reject) => {
        let isDirty = true;
        switch (oldVersion) {
          case 1:
            item.price = 0;
            break;
          default:
            isDirty = false;
        }
        resolve(isDirty);
      });
    }
  })
  .build(options);
```

## Collection

A collection is a store of a certain type of data which has basic CRUD functionalities. You can get the collection instance by,

```js
const col = esdb.collection('Product');
```

A collection instance has the following functions and properties.

```ts
interface EsdbCollection {
  name: string;
  key: string;

  get: (key: string) => Promise<object>;
  getAll: (where?: EsdbQuery) => Promise<object[]>;
  count: (where?: EsdbQuery) => Promise<number>;

  insert: (doc: object) => Promise<object>;
  upsert: (doc: object) => Promise<object>;
  update: (doc: object) => Promise<object>;
  remove: (key: string) => Promise<object>;

  updateIf: (setter: object, where?: EsdbQuery) => Promise<object[]>;
  removeIf: (where?: EsdbQuery) => Promise<object[]>;
  clear: () => Promise<void>;
}
```

You can create a query for data manipulation and fetch operation. The following example shows that it fetches the products which price is less or equal to 2.

```js
import { EsdbQuery } from 'esdb';

const getCheapProducts = () => {
  return new Promise(async resolve => {
    // create new query
    const query = new EsdbQuery({
      'price': { '<=': 2 }
    });
    query.offset = 0; // specify the offset
    query.limit = 20; // specify the limit

    const col = esdb.collection('Product');
    const cheapProducts = await col.getAll(query);
    resolve(cheapProducts);
  });
};
```

## Encryption

You can put your own encryption algorithm into the database. On the initialization, you can set the algorithm like the below.

```js
import customEncryption from '/your/encrypt/path';

esdb
  ...
  .encrypt(customEncryption)
  ...
  .build();
```

The `CustomEncryption` is an implementation of `EsdbEncryption`.

```ts
interface EsdbEncryption {
  encrypt(data: object): Promise<string>;
  decrypt(cipher: string): Promise<object>;
}
```

## License

**GNU GENERAL PUBLIC LICENSE**  
Version 3, 29 June 2007  
Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>.

Everyone is permitted to copy and distribute verbatim copies of this license document, but changing it is not allowed.