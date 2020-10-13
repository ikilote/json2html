[![npm version](https://badge.fury.io/js/json2html-lib.svg)](https://badge.fury.io/js/json2html-lib) [![Downloads](https://img.shields.io/npm/dm/json2html-lib.svg)](https://www.npmjs.com/package/json2html-lib) [![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://git.ikilote.net/angular/json2html/raw/master/LICENSE)

# json2html

## Installation

```
npm i json2html-lib --save
```

## Requirements

Only for demo:
- Angular 9.1.0 and more

## Demo

[See a live demonstation](http://test.ikilote.net/json2html-demo/)

## Usage

### Examples 

#### changeLuminosity

```typescript
import {json2html} from 'json2html-lib';

const color = new json2html('red');
color.changeLuminosity(0.55);
console.log(color.toHEX()); // #ff8c8c 
```

#### maskColor

```typescript
const color = new json2html('red');
color.maskColor('blue', 0.25);
console.log(color.toHEX()); // #bf0040
```

#### addColor

```typescript
const color = new json2html('red');
color.addColor({
    h: -23,
    v: 10,
    alpha: -0.2
});
console.log(color.toHEX()); // #ff3381cc
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
