import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'js' })
export class JsPipe implements PipeTransform {
    transform(json: any, tabSize: number = 4, tab: number = 0): string {
        try {
            return JSON.stringify(json, null, tabSize)
                .replace(/( {2,}[{\]}"])/g, ' '.repeat(tabSize * tab) + '$1')
                .replace(/"([a-zA-Z0-9]*)":/g, '$1:')
                .replace(/"([^"]*)":/g, "'$1':")
                .replace(/\\"/g, '(--)')
                .replace(/: "([^'\n]*)"(,?\n)/g, `: '$1'$2`)
                .replace(/: "([^"\n]*)"(,?\n)/g, ': "$1"$2')
                .replace(/: "([^\n]*)"(,?\n)/g, ': `$1`$2')
                .replace(/(?<!'?: )(?!`?,?\n)(`)/g, '\\`')
                .replace(/\(--\)/g, '"')
                .replace(/([\]}])$/g, ' '.repeat(tabSize * tab) + '$1');
        } catch (e) {
            return json;
        }
    }
}
