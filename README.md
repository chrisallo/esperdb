# esdb

A MongoDB-like document database wrapper for JavaScript. It wraps various database solutions like IndexedDB or AsyncStorage and turns them into a fully-indexed, document-based database.

## Install

```
~$ npm install --save esdb
```

## How to use

### Prerequisite

`esdb` has a base interface that should be implemented. It wraps the key-value database so that `esdb` could use it as a storage. The interface looks like the below.

```ts
interface EsdbBaseStore {
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
import CustomStoreImplementsEsdbBaseStore from '/your/base/path';

esdb
  .name('example.product.db')
  .version(2)
  .store(CustomStoreImplementsEsdbBaseStore)
  .schema({
    // collection name
    name: 'Product',

    // data model
    interface: {
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
    migrate: currentVersion => {
      return new Promise((resolve, reject) => {
        switch (currentVersion) {
          case 1:
            break;
        }
        resolve();
      });
    }
  })
  .build()
  .then(db => {
    // db is equivalent to `esdb`
    // implement the logic here
  })
  .catch(err => {
    // handle the error here
  });
```

## Collection

A collection is a store of a certain type of data which has basic CRUD functionalities. You can get the collection instance by,

```js
const col = esdb.collection('Product');
```

A collection instance has the following functions.

```ts
interface EsdbCollection {
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

## Encryption

You can put your own encryption algorithm into the database. On the initialization, you can set the algorithm like the below.

```js
import CustomEncryption from '/your/encrypt/path';

esdb
  .version(2)
  .store(CustomStoreImplementsEsdbBaseStore)
  .encrypt(CustomEncryption)
  ...
  .build()
  ...
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