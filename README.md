# esperdb

A document database wrapper for JavaScript. It wraps various key-value based database solutions and turns them into a fully-indexed, document-based database.

## Install

`esperdb` is distributed through NPM.

```
~$ npm install --save esperdb
```

or

```
~$ yarn install esperdb
```

## Build and test

To build the source code, simply do

```
~$ npm run build
```

An automated test is ready for the stability of `esperdb` which is written in `mocha`.

```
~$ npm run test
```

## How to use

### Prerequisite

`esperdb` uses a store with an interface that should be implemented. It wraps the key-value database so that `esperdb` could use it as a storage. The interface looks like the below.

```ts
interface EsperStore {
  init(name: string, version: number): Promise<void>;
  getItem(key: string): Promise<object>;
  setItem(key: string, item: object): Promise<object>;
  removeItem(key: string): Promise<object>;
  clearAllItems(): Promise<void>;
}
```

> NOTE: If `EsperStore` implementation is not provided, it uses default built-in memory-based database instead.

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
import esperdb from 'esperdb';
import customStoreImplementsEsperStore from '/your/base/path';

esperdb
  .name('example.product.db')
  .version(2)
  .store(customStoreImplementsEsperStore)
  .config(options)
  .schema({
    // collection name
    name: 'Product',

    // primary key
    key: 'id',

    // indexes (optional)
    indexes: [
      ['name', 'price'],
      ['--createdAt'] // double-negative means the reversed index
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
const col = esperdb.collection('Product');
```

A collection instance has the following functions and properties.

```ts
interface EsperCollection {
  name: string;
  key: string;

  get: (key: string) => Promise<object>;
  getAll: (
    where?: EsperQuery,
    options?: { skip?: number, limit?: number }
  ) => Promise<object[]>;
  count: (where?: EsperQuery) => Promise<number>;

  insert: (doc: object) => Promise<object>;
  upsert: (doc: object) => Promise<object>;
  update: (doc: object) => Promise<object>;
  remove: (key: string) => Promise<object>;

  updateIf: (setter: object, where?: EsperQuery) => Promise<object[]>;
  removeIf: (where?: EsperQuery) => Promise<object[]>;
  clear: () => Promise<void>;
}
```

You can create a query for data manipulation and fetch operation. The following example shows that it fetches the products which price is less or equal to 2.

```js
import { EsperQuery } from 'esperdb';

const getCheapProducts = async () => {
  // create new query
  const query = new EsperQuery({
    price: { '<=': 2.0 }
  });

  const col = esperdb.collection('Product');
  const cheapProducts = await col.getAll(query, {
    skip: 0,
    limit: 20,
    orderBy: '--createdAt'
  });
  return cheapProducts;
};
```

## Encryption

You can put your own encryption algorithm into the database. On the initialization, you can set the algorithm like the below.

```js
import customEncryption from '/your/encrypt/path';

esperdb
  ...
  .encrypt(customEncryption)
  ...
  .build();
```

The `CustomEncryption` is an implementation of `EsperEncryption`.

```ts
interface EsperEncryption {
  encrypt(data: string): Promise<string>;
  decrypt(cipher: string): Promise<string>;
}
```

## License

**GNU GENERAL PUBLIC LICENSE**  
Version 3, 29 June 2007  
Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>.

Everyone is permitted to copy and distribute verbatim copies of this license document, but changing it is not allowed.