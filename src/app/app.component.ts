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
      attrs: { id: 'test', class: 'testclasse' },
      body: 'test'
    }, { formatting: 'multiline' }).toString());

    console.log(new Json2html({
      tag: 'div',
      attrs: { id: 'test', class: 'testclasse', test: null },
      body: [
        'test',
        {
          tag: 'div',
          attrs: { id: 'test', class: 'testclasse', test: null },
          body: [
            'test2'
          ]
        }
      ]
    }).toString());

  }
}
