
export interface Json2htmlAttr { [key: string]: string | number | undefined | null }

export interface Json2htmlRef {
    tag: string,
    attrs?: Json2htmlAttr,
    body?: (Json2htmlRef | string)[] | string
}

export interface Json2htmlOptions {
    formatting?: 'inline' | 'multiline';
    spaceType?: 'space' | 'tab',
    spaceLength?: 4,
    spaceBase?: 0,
    maxLenght?: 0,
    attrPosition?: 'inline' | 'space' | 'alignTag' | 'alignFirstAttr',
    type?: 'html' | 'xml',
    indent?: boolean
}

export class Json2html {

    readonly options: Json2htmlOptions = {
        spaceType: 'space',
        spaceLength: 4,
        spaceBase: 0,
        maxLenght: 0,
        attrPosition: 'alignFirstAttr',
        type: 'html',
        formatting: 'multiline',
        indent: true
    }

    constructor(
        public json: Json2htmlRef,
        option: Json2htmlOptions = {}
    ) {
        Object.assign(this.options, option);
    }

    toString() {
        return this._generate(0, this.json);
    }

    private _generate(lvl: number, json: Json2htmlRef) {
        const tagBegin = `<${json.tag}${this._generateAttrs(lvl, json)}>`
        let tagcontent = this._generateHtml(lvl, json);
        if (tagcontent) {
            if (this._hasMultiline()) {
                tagcontent = `${tagcontent}\n${this._getSpacing(lvl)}`;
            }
        }
        const tagEnd = `</${json.tag}>`;

        return `${tagBegin}${tagcontent}${tagEnd}`;
    }

    private _generateAttrs(lvl: number, json: Json2htmlRef) {
        let string = '';
        let attrs = json.attrs;
        if (json.attrs && Object.keys(json.attrs).length) {
            for (let id in json.attrs) {
                switch (this.options.attrPosition) {
                    case 'inline':
                        string += ' ';
                        break;
                    case 'space':
                        if (string && this.options.indent) {
                            string += `\n${this._getSpacing(lvl + 1)}`;
                        } else {
                            string += ' ';
                        };
                        break;
                    case 'alignTag':
                        if (string && this.options.indent) {
                            string += `\n${this._getSpacing(lvl, 1)}`;
                        } else {
                            string += ' ';
                        };
                        break;
                    case 'alignFirstAttr':
                        if (string && this.options.indent) {
                            string += `\n${this._getSpacing(lvl, this.json.tag.length + 2)}`;
                        } else {
                            string += ' ';
                        };
                        break;
                }
                string += `${id}${json.attrs[id] !== null || json.attrs[id] !== undefined ? `="${json.attrs[id]}"` : ''}`;
            }
        }
        return string;
    }

    private _generateHtml(lvl: number, json: Json2htmlRef) {
        let string = '';
        if (json.body) {
            if (typeof json.body === 'string') {
                if (this._hasMultiline()) {
                    string = `\n${this._getSpacing(lvl + 1)}`;
                }
                string += json.body;
            } else {
                json.body.forEach((element) => {
                    if (this._hasMultiline()) {
                        string += `\n${this._getSpacing(lvl + 1)}`;
                    }
                    if (typeof element === 'string') {
                        string += element;
                    } else {
                        string += this._generate(lvl + 1, element);
                    }
                })
            }
        }
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
