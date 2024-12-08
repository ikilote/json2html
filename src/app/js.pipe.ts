import { Pipe, PipeTransform } from '@angular/core';

import { Json2Js } from 'projects/json2html/src/public_api';

@Pipe({
    name: 'js',
    standalone: false,
})
export class JsPipe implements PipeTransform {
    transform(json: any, tabSize: number = 4, tabAdded: number = 0): string {
        try {
            return new Json2Js(json, { tabSize, tabAdded }).toString();
        } catch (e) {
            return json;
        }
    }
}
