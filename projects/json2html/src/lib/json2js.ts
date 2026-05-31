export class Json2Js {
    /**
     * @param json json to transform
     * @param options :
     * * `tabSize` tab size (in space)
     * * `tabAdded` additional tabs before all lines
     * * `tabAddedExceptFirst` no additional tabs on first line
     */
    constructor(
        public json: any,
        public options: { tabSize?: number; tabAdded?: number; tabAddedExceptFirst?: boolean } = {},
    ) {}

    /**
     * transform Json to js style object
     * @returns text like js object
     */
    toString(): string {
        const tabSize = Math.max(this.options.tabSize ?? 4, 0);
        const tabAdded = Math.max(this.options.tabAdded ?? 0, 0);
        const tabAddedExceptFirst = this.options.tabAddedExceptFirst ?? false;
        /* Uses lookbehind assertion (?<!: ) which is supported in modern browsers (Chrome 62+, Firefox 78+, Safari 16.4+) */
        const backTickReplaceRegex = new RegExp("(?!\\s*.+'?: ['\"].*)((?<!: )`(?!,|\n))(?!.*['\"],?\n)", 'g');

        try {
            return (
                (tabAddedExceptFirst ? '' : ' '.repeat(tabSize * tabAdded)) +
                (typeof this.json === 'string' ? this.json : JSON.stringify(this.json, null, tabSize))
                    .replace(/( {2,}[{\]}"])/g, ' '.repeat(tabSize * tabAdded) + '$1')
                    .replace(/"([a-zA-Z0-9]*)":/g, '$1:')
                    .replace(/"([^"]*)":/g, "'$1':")
                    .replace(/\\"/g, '(--)')
                    .replace(/: "([^'\n]*)"(,?\n)/g, `: '$1'$2`)
                    .replace(/: "([^"\n]*)"(,?\n)/g, ': "$1"$2')
                    .replace(/: "([^\n]*)"(,?\n)/g, ': `$1`$2')
                    .replace(backTickReplaceRegex, '\\`')
                    .replace(/\(--\)/g, '"')
                    .replace(/([\]}])$/g, ' '.repeat(tabSize * tabAdded) + '$1')
            );
        } catch (e) {
            throw new Error('Json2Js: impossible to transform', { cause: e });
        }
    }
}
