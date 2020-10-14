
export interface Json2htmlAttr {
    [key: string]: string | number | null;
}

export type Json2htmlBody = (Json2htmlRef | string)[] | Json2htmlRef | string;

export interface Json2htmlRef {
    tag: string;
    attrs?: Json2htmlAttr;
    body?: Json2htmlBody;
}

export interface Json2htmlOptions {
    formatting?: 'inline' | 'multiline';
    spaceType?: 'space' | 'tab';
    spaceLength?: number;
    spaceBase?: number;
    maxLenght?: number;
    attrPosition?: 'inline' | 'space' | 'alignTag' | 'alignFirstAttr';
    // type?: 'html' | 'xml';
    indent?: boolean;
    noContentTags?: string[];
}

export class Json2html {

    readonly options: Json2htmlOptions = {
        spaceType: 'space',
        spaceLength: 4,
        spaceBase: 0,
        maxLenght: 0,
        attrPosition: 'alignFirstAttr',
        // type: 'html',
        formatting: 'multiline',
        indent: true,
        noContentTags: [
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
            'wbr'
        ]
    };

    constructor(
        public json: Json2htmlRef | Json2htmlRef[],
        option: Json2htmlOptions = {}
    ) {
        Object.assign(this.options, option);
    }

    toString() {
        let html = '';
        if (!Array.isArray(this.json)) {
            html = `${this._getSpacing(0)}${this._generate(0, this.json)}`;
        } else {
            this.json.forEach((element, index) => {
                html += `${index > 0 ? '\n' : ''}${this._getSpacing(0)}${this._generate(0, element)}`;
            });
        }
        return html;
    }

    private _generate(lvl: number, json: Json2htmlRef) {
        const hasContent = !this.options.noContentTags.includes(json.tag.toLowerCase());
        let string = `<${json.tag}${this._generateAttrs(lvl, json)}>`;
        if (hasContent) {
            let tagcontent = this._generateBody(lvl, json);
            if (tagcontent && this._hasMultiline()) {
                tagcontent = `${tagcontent}\n${this._getSpacing(lvl)}`;
            }
            string += `${tagcontent}</${json.tag}>`;
        }
        return string;
    }

    private _generateAttrs(lvl: number, json: Json2htmlRef) {
        let string = '';
        const attrs = json.attrs;
        if (attrs && Object.keys(attrs).length) {
            for (const id in attrs) {
                if (attrs[id] !== undefined) {
                    let attr = '';
                    switch (this.options.attrPosition) {
                        case 'inline':
                            attr += ' ';
                            break;
                        case 'space':
                            attr += string && this.options.indent && this._hasMultiline()
                                ? `\n${this._getSpacing(lvl + 1)}`
                                : string += ' ';
                            break;
                        case 'alignTag':
                            attr += string && this.options.indent && this._hasMultiline()
                                ? `\n${this._getSpacing(lvl, 1)}`
                                : ' ';
                            break;
                        case 'alignFirstAttr':
                            attr += string && this.options.indent && this._hasMultiline()
                                ? `\n${this._getSpacing(lvl, json.tag.length + 2)}`
                                : ' ';
                            break;
                    }
                    attr += `${id}${attrs[id] !== null || attrs[id] ? `="${attrs[id]}"` : ''}`;
                    string += attr;
                }
            }
        }
        return string;
    }

    private _generateBody(lvl: number, json: Json2htmlRef) {
        let string = '';
        if (json.body) {
            if (typeof json.body === 'string') {
                if (this._hasMultiline()) {
                    string = `\n${this._getSpacing(lvl + 1)}`;
                }
                string += json.body;
            } else if (!Array.isArray(json.body)) {
                string += this._generateBodyElement(lvl, json);
            } else {
                json.body.forEach(element => {
                    string += this._generateBodyElement(lvl, element);
                });
            }
        }
        return string;
    }

    private _generateBodyElement(lvl: number, element: Json2htmlRef | string): string {
        let string = '';
        if (this._hasMultiline()) {
            string += `\n${this._getSpacing(lvl + 1)}`;
        }
        string += typeof element === 'string'
            ? element
            : this._generate(lvl + 1, element);
        return string;
    }

    private _hasMultiline(): boolean {
        return this.options.formatting === 'multiline';
    }

    private _getSpacing(lvl: number, ajout: number = 0): string {
        return this.options.indent
            ? (this.options.spaceType === 'space' ? ' ' : '\t')
                .repeat((lvl + this.options.spaceBase) * this.options.spaceLength + ajout)
            : '';
    }

}
