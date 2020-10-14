[![npm version](https://badge.fury.io/js/@zaide/json2html.svg)](https://badge.fury.io/js/@zaide/json2html) [![Downloads](https://img.shields.io/npm/dm/@zaide/json2html.svg)](https://www.npmjs.com/package/@zaide/json2html) [![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://git.ikilote.net/angular/json2html/raw/master/LICENSE)

# json2html

## Installation

```
npm i @zaide/json2html --save
```

## Requirements

Only for demo:
- Angular 10.0.0 and more

## Demo

[See a live demonstation](http://test.ikilote.net/json2html-demo/)

## Usage

### Examples 

```typescript
import { Json2html } from '@zaide/json2html';

console.log(new Json2html({
      tag: 'div',
      attrs: { id: 'test1', class: 'testclasse' },
      body: ['test',
        {
          tag: 'div',
          attrs: { id: 'test2', class: 'foobar' },
          body: 'test'
        }
      ]
    }, { formatting: 'inline' }).toString());
```

## Publishing the library

```
ng build json2html --prod
cp *.md dist/json2html
cd dist/json2html
npm publish
```

## Publishing the demo

```
ng build --prod
```

## License

This module is released under the permissive MIT license. Your contributions are always welcome.
