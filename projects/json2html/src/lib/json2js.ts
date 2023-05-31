export class Json2Js {
    /**
     * @param json json to transform
     * @param options :
     * * `tabSize` tab size (in space)
     * * `tabAdded` additional tabs before all lines
     */
    constructor(public json: any, public options: { tabSize?: number; tabAdded?: number } = {}) {}

    /**
     * transform Json to js style object
     * @returns text like js object
     */
    toString(): string {
        const tabSize = Math.max(this.options.tabSize ?? 4, 0);
        const tabAdded = Math.max(this.options.tabAdded ?? 0, 0);
        /* Local RegExp in order to limit impact on browsers without lookbehind support (ex : Safari) */
        const backTickReplaceRegex = new RegExp("(?!\\s*.+'?: ['\"].*)((?<!: )`(?!,|\n))(?!.*['\"],?\n)", 'g');

        try {
            return (typeof this.json === 'string' ? this.json : JSON.stringify(this.json, null, tabSize))
                .replace(/( {2,}[{\]}"])/g, ' '.repeat(tabSize * tabAdded) + '$1')
                .replace(/"([a-zA-Z0-9]*)":/g, '$1:')
                .replace(/"([^"]*)":/g, "'$1':")
                .replace(/\\"/g, '(--)')
                .replace(/: "([^'\n]*)"(,?\n)/g, `: '$1'$2`)
                .replace(/: "([^"\n]*)"(,?\n)/g, ': "$1"$2')
                .replace(/: "([^\n]*)"(,?\n)/g, ': `$1`$2')
                .replace(backTickReplaceRegex, '\\`')
                .replace(/\(--\)/g, '"')
                .replace(/([\]}])$/g, ' '.repeat(tabSize * tabAdded) + '$1');
        } catch (e) {
            const error = new Error('Json2Js: impossible to transform');
            error.stack = e.stack;
            throw error;
        }
    }
}
