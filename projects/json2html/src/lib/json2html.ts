
export interface Json2htmlAttr {
    [key: string]: string | number | null;
}

export type Json2htmlBody = (Json2htmlRef | string)[] | Json2htmlRef | string;

export interface Json2htmlRef {
    /** tag name */
    tag: string;
    /** attributes */
    attrs?: Json2htmlAttr;
    /** content of tag */
    body?: Json2htmlBody;
    /** inline : override formatting option for this element and these children */
    inline?: boolean;
    /** autoclose (XML only) */
    autoclose?: boolean;
}

export interface Json2htmlOptions {
    /**
     * format of the rendered structure:
     * * `inline`: all on one line without space
     * * `multiline`: structure sur plusieur lignes avec indentation possible
     */
    formatting?: 'inline' | 'multiline';
    /** type d'indentation `space` or `tab` */
    spaceType?: 'space' | 'tab';
    /** size of each level of the indentation  */
    spaceLength?: number;
    /** size of the indentation before each line */
    spaceBase?: number;
    /** maximum number of characters for a line */
    // maxLenght?: number;
    /**
     * attribute alignment:
     * * `inline`: no alignment
     * * `space`: alignment with higher level
     * * `alignTag`: alignment with the tag
     * * `alignFirstAttr`: alignment with the first attribute
     */
    attrPosition?: 'inline' | 'space' | 'alignTag' | 'alignFirstAttr';
    /** Format of the targeted structure */
    type?: 'html' | 'xml';
    /** in XML mode, auto generated tag if the only text alongside other tags */
    xmlDefaultTag?: string;
    /** active of not en indentation. If false, these options are ignored : `spaceType`, `spaceLength` */
    indent?: boolean;
    /** list of HTML tags without content */
    noContentTags?: string[];
}

export class Json2html {

    readonly options: Json2htmlOptions = {
        spaceType: 'space',
        spaceLength: 4,
        spaceBase: 0,
        // maxLenght: 0,
        attrPosition: 'alignFirstAttr',
        type: 'html',
        formatting: 'multiline',
        indent: true,
        xmlDefaultTag: 'span',
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

    /**
     * @param json one ou list of node data
     * @param option formating options
     */
    constructor(
        public json: Json2htmlRef | Json2htmlRef[],
        option: Json2htmlOptions = {}
    ) {
        Object.assign(this.options, option);
    }

    /**
     * rendering in string
     */
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

    /**
     * generation in string for a node (tag with attributes and content)
     * @param lvl node level
     * @param json node data
     * @returns render of node
     */
    private _generate(lvl: number, json: Json2htmlRef): string {
        const hasContent = !this.options.noContentTags.includes(json.tag.toLowerCase());
        const xmlAutoClose = !hasContent && this.options.type === 'xml' ? '/' : '';
        let string = `<${json.tag}${this._generateAttrs(lvl, json)}${xmlAutoClose}>`;
        if (hasContent) {
            let tagcontent = this._generateBody(lvl, json);
            if (tagcontent && this._hasMultiline()) {
                tagcontent = `${tagcontent}\n${this._getSpacing(lvl)}`;
            }
            string += `${tagcontent}</${json.tag}>`;
        }
        return string;
    }

    /**
     * attributes list generation
     * @param lvl level node
     * @param json node data
     * @returns attributes tag
     */
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

    /**
     * tag body generation
     * @param lvl level node
     * @param json node data
     * @returns render of body
     */
    private _generateBody(lvl: number, json: Json2htmlRef) {
        let string = '';
        if (json.body) {
            if (!Array.isArray(json.body)) {
                string += this._generateBodyElement(lvl, json.body, true);
            } else {
                json.body.forEach(element => {
                    string += this._generateBodyElement(lvl, element, false);
                });
            }
        }
        return string;
    }

    /**
     * tag body generation for one node
     * @param lvl level node
     * @param element node data or string
     * @param onlyOne body this an unique node
     * @returns render of body
     */
    private _generateBodyElement(lvl: number, element: Json2htmlRef | string, onlyOne: boolean): string {
        let string = '';
        if (this._hasMultiline()) {
            string += `\n${this._getSpacing(lvl + 1)}`;
        }

        // in XML mode, for generate a valid XML structure
        if (!onlyOne && this.options.type === 'xml' && typeof element === 'string') {
            element = {
                tag: this.options.xmlDefaultTag,
                body: element
            };
        }

        string += typeof element === 'string'
            ? element
            : this._generate(lvl + 1, element);
        return string;
    }

    /**
     * if multiline rendering
     */
    private _hasMultiline(): boolean {
        return this.options.formatting === 'multiline';
    }

    /**
     * calculating the number of spaces for indentation
     * @param lvl level
     * @param addition space of space (only space, no tabulation)
     * @returns space
     */
    private _getSpacing(lvl: number, addition: number = 0): string {
        return this.options.indent
            ? (this.options.spaceType === 'space' ? ' ' : '\t')
                .repeat((lvl + this.options.spaceBase) * this.options.spaceLength) + ' '.repeat(addition)
            : '';
    }

}
