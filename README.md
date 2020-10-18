# json2html

Generation of an HTML plain text from a Json structure with several setting options.

[![npm version](https://badge.fury.io/js/json2html-lib.svg)](https://badge.fury.io/js/json2html-lib) [![Downloads](https://img.shields.io/npm/dm/json2html-lib.svg)](https://www.npmjs.com/package/json2html-lib) [![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://git.ikilote.net/angular/json2html/raw/master/LICENSE)

## Installation

```
npm i json2html-lib --save
```

## Requirements

Only for demo:
- Angular 10.0.0 and more

## Demo

[See a live demonstation](http://test.ikilote.net/json2html-demo/)

## Usage

### Examples 

```typescript
import { Json2html } from 'json2html-lib';

console.log(new Json2html({
      tag: 'div',
      attrs: { id: 'test1', class: 'testclasse' },
      body: [
        'test',
        {
          tag: 'div',
          attrs: { id: 'test2', class: 'foobar' },
          body: 'test'
        }
      ]
    }, { formatting: 'multiline' }).toString());
/*
<div id="test1"
     class="testclasse">
    test
    <div id="test2"
         class="foobar">
        test
    </div>
</div>
*/
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
