# json2html

Generation of an HTML plain text from a Json structure with several setting options.

[![npm version](https://badge.fury.io/js/@ikilote%2Fjson2html.svg)](https://badge.fury.io/js/@ikilote%2Fjson2html) [![Downloads](https://img.shields.io/npm/dm/@ikilote%2Fjson2html.svg)](https://www.npmjs.com/package/@ikilote%2Fjson2html) [![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://git.ikilote.net/angular/json2html/raw/master/LICENSE)

## Installation

```
npm i @ikilote/json2html --save
```

Note for Angular:

- 0.0.6 : for View Engine
- 0.1.0+ : for Ivy

## features

- **Json2HTML**: json or js object →
    - HTML
    - XML
    - Angular template string (with `@`)
    - Comment
    - Doctype
    - etc.
- **Json2Js**: json →
    - js object string

## Demo

[See a live demonstation](http://test.ikilote.net/json2html-demo/)

## Usage

### Example `Json2html`

```typescript
import { Json2html } from '@ikilote/json2html';

console.log(
    new Json2html(
        {
            tag: 'div',
            attrs: { id: 'test1', class: 'testclasse' },
            body: [
                'test',
                {
                    tag: 'div',
                    attrs: { id: 'test2', class: 'foobar' },
                    body: 'test',
                },
            ],
        },
        { formatting: 'multiline' },
    ).toString(),
);
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

```typescript
import { Json2html } from '@ikilote/json2html';

console.log(
    new Json2html(
        [
            {
                annotation: 'let',
                value: 'a = "2"',
            },
            {
                annotation: 'if',
                conditional: 'a === "1"',
                body: {
                    tag: 'a',
                    attrs: {
                        href: 'https://example.com',
                    },
                    body: 'lien',
                },
            },
            {
                annotation: 'else',
                body: {
                    tag: 'a',
                    attrs: {
                        href: 'https://test.com',
                    },
                    body: 'lien',
                },
                attached: true,
            },
            {
                annotation: 'switch',
                conditional: 'a',
                body: [
                    {
                        annotation: 'case',
                        conditional: 'caseA',
                        body: 'Value A',
                    },
                    {
                        annotation: 'case',
                        conditional: 'caseB',
                        body: 'Value B',
                    },
                    {
                        annotation: 'default',
                        body: 'Default',
                    },
                ],
            },
        ],
        { formatting: 'multiline' },
    ).toString(),
);
/*
@let a = "2";
@if (a === "1") {
    <a href="https://example.com">
        lien
    </a>
} @else {
    <a href="https://test.com">
        lien
    </a>
}
@switch (a) {
    @case (caseA) {
        Value A
    }
    @case (caseB) {
        Value B
    }
    @default {
        Default
    }
}
*/
```

### Example `Json2Js`

```json
{
    "tag": "div",
    "attrs": {
        "id": "test",
        "class": "testclasse",
        "test": null,
        "data-test1": "`value1`",
        "data-test2": "'value2'",
        "data-test3": "\"value3\""
    }
}
```

```typescript
import { Json2html } from '@ikilote/json2html';

console.log(new Json2html(myJson, { tabSize: 2, tadAdded: 1 }).toString());
/*
{
  tag: 'div',
  attrs: {
    id: 'test',
    class: 'testclasse',
    test: null,
    'data-test1': '`value1`',
    'data-test2': `'value2'`,
    'data-test3': '"value3"'
  }
}
*/
```

## Publishing the library

```
npm run build:lib
npm run publish:lib
```

## Publishing the demo

```
npm run build:demo
```

## License

This module is released under the permissive MIT license. Your contributions are always welcome.
