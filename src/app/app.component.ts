import { Component } from '@angular/core';

import {
  Json2html,
  Json2htmlOptions,
  Json2htmlRef,
} from 'projects/json2html/src/public_api';

import { examples } from './app.json';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // options
    spaceType: 'space' | 'tab' = 'space';
    spaceLength = 4;
    spaceBase = 0;
    // maxLenght= 0;
    attrPosition: 'inline' | 'space' | 'alignTag' | 'alignFirstAttr' = 'alignFirstAttr';
    wrapAttrNumber = 1;
    maxLength = 0;
    type: 'html' | 'xml' = 'html';
    formatting: 'inline' | 'multiline' = 'multiline';
    indent = true;
    xmlDefaultTag = 'span';
    noContentTags = [
        'area',
        'base',
        'br',
        'col',
        'command',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr',
    ].toString();
    removeOptionalEndTags = false;
    optionalEndTags = [
        'colgroup',
        'dd',
        'dt',
        'li',
        'optgroup',
        'option',
        'p',
        'rb',
        'rt',
        'rtc',
        'rp',
        'td',
        'th',
        'thead',
        'tbody',
        'tfoot',
        'tr',
    ].toString();

    data: Json2htmlRef | Json2htmlRef[];
    html: string;

    constructor() {
        this.updateExample(1);
    }

    updateExample(number: number) {
        this.data = examples[number];
        this.generated();
    }

    format(json: string) {
        try {
            this.data = JSON.parse(json);
            this.generated();
        } catch (error) {
            console.error(error);
        }
    }

    generated() {
        const options: Json2htmlOptions = {
            spaceType: this.spaceType,
            spaceLength: this.spaceLength,
            spaceBase: this.spaceBase,
            attrPosition: this.attrPosition,
            type: this.type,
            formatting: this.formatting,
            indent: this.indent,
            xmlDefaultTag: this.xmlDefaultTag,
            wrapAttrNumber: this.wrapAttrNumber,
            maxLength: this.maxLength,
            noContentTags: this.noContentTags.split(','),
            removeOptionalEndTags: this.removeOptionalEndTags,
            optionalEndTags: this.optionalEndTags.split(','),
        };

        console.log(options);
        this.html = new Json2html(this.data, options).toString();
    }
}
