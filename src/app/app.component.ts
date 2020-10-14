import { Component } from '@angular/core';

import { Json2html } from 'projects/json2html/src/public_api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor() {

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

        console.log(new Json2html([{
            tag: 'div',
            attrs: { id: 'test', class: 'testclasse', test: null },
            body: [
                'test',
                {
                    tag: 'div',
                    attrs: { id: 'test-div', class: 'foo' },
                    body: [
                        'test2',
                        {
                            tag: 'div',
                            attrs: { id: 'test-subdiv', class: 'foobar' },
                            body: 'test3'
                        }
                    ]
                },
                {
                    tag: 'hr'
                },
                {
                    tag: 'span',
                    attrs: { id: 'test-span', class: 'bar' },
                    body: [
                        'test2'
                    ]
                },
            ]
        },
        {
            tag: 'span',
            attrs: { id: 'attr-2', class: 'bar' },
            body: [
                'test2'
            ]
        }], {
            spaceBase: 5
        }).toString());

    }
}
