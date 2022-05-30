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
    /** autoclose: ignore body and end tag */
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
    maxLength?: number;
    /**
     * attribute alignment:
     * * `inline`: no alignment
     *   * `inline space`: wrap with alignment with higher level
     *   * `inline alignTag`: wrap with alignment with the tag
     *   * `inline alignFirstAttr`: wrap alignment with the first attribute
     * * `space`: alignment with higher level
     * * `alignTag`: alignment with the tag
     * * `alignFirstAttr`: alignment with the first attribute
     * * `prettier`: like Prettier formatter
     */
    attrPosition?:
        | 'inline'
        | 'inline space'
        | 'inline alignTag'
        | 'inline alignFirstAttr'
        | 'space'
        | 'alignTag'
        | 'alignFirstAttr'
        | 'prettier';
    /** attr number wen  0 == 'inline' */
    wrapAttrNumber?: number;
    /** Format of the targeted structure */
    type?: 'html' | 'xml';
    /** in XML mode, auto generated tag if the only text alongside other tags */
    xmlDefaultTag?: string;
    /** active of not en indentation. If false, these options are ignored : `spaceType`, `spaceLength` */
    indent?: boolean;
    /** list of HTML tags without content */
    noContentTags?: string[];
    /** remove optional end tags */
    removeOptionalEndTags?: boolean;
    /** list of HTML tags with options end tag */
    optionalEndTags?: string[];
}

export class Json2html {
    readonly options: Json2htmlOptions = {
        spaceType: 'space',
        spaceLength: 4,
        spaceBase: 0,
        maxLength: 0,
        attrPosition: 'alignFirstAttr',
        wrapAttrNumber: 1,
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
            'wbr',
        ],
        removeOptionalEndTags: false,
        optionalEndTags: [
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
        ],
    };

    /**
     * @param json one ou list of node data
     * @param option formating options
     */
    constructor(public json: Json2htmlRef | Json2htmlRef[], option: Json2htmlOptions = {}) {
        Object.assign(this.options, option);
    }

    /**
     * rendering in string
     */
    toString() {
        let html = '';
        const inline = this.options.formatting === 'inline';
        if (!Array.isArray(this.json)) {
            html = `${this._getSpacing(0)}${this._generate(0, this.json, inline)}`;
        } else {
            this.json.forEach((element, index) => {
                html += `${index > 0 && !inline ? '\n' : ''}${this._getSpacing(0)}${this._generate(
                    0,
                    element,
                    inline,
                )}`;
            });
        }
        return html;
    }

    /**
     * generation in string for a node (tag with attributes and content)
     * @param lvl node level
     * @param json node data
     * @param inline force inline
     * @returns render of node
     */
    private _generate(lvl: number, json: Json2htmlRef, inline: boolean = false): string {
        const hasContent = !this.options.noContentTags.includes(json.tag.toLowerCase());
        const xmlAutoClose = (!hasContent || json.autoclose) && this._modeXML() ? '/' : '';
        let string = `<${json.tag}${this._generateAttrs(lvl, json, inline || json.inline)}${xmlAutoClose}>`;
        if (hasContent && !json.autoclose) {
            let tagcontent = this._generateBody(lvl, json, inline || json.inline);
            if (tagcontent && this._hasMultiline() && !(inline || json.inline)) {
                tagcontent = `${tagcontent}\n${this._getSpacing(lvl)}`;
            }
            string += tagcontent;
            if (
                !this.options.removeOptionalEndTags ||
                this._modeXML() ||
                (this.options.removeOptionalEndTags && !this.options.optionalEndTags.includes(json.tag.toLowerCase()))
            ) {
                string += `</${json.tag}>`;
            }
        }
        return string;
    }

    /**
     * attributes list generation
     * @param lvl level node
     * @param json node data
     * @param inline force inline
     * @returns attributes tag
     */
    private _generateAttrs(lvl: number, json: Json2htmlRef, inline: boolean) {
        let string = '';
        const attrs = json.attrs;
        if (attrs && Object.keys(attrs).length) {
            const length = Object.values(json.attrs).filter(i => i !== undefined).length;
            const typeAlign =
                (this.options.wrapAttrNumber ?? 1) < length && !inline ? this.options.attrPosition : 'inline';
            let attrLine = `${this._getSpacing(lvl, 1)}${json.tag}`;
            let count = 1;

            Object.keys(attrs).forEach((id, index, array) => {
                const value = attrs[id];
                if (value !== undefined) {
                    const attrCurrent = `${id}${value !== null || value ? `="${value}"` : ''}`;

                    let attr = '';
                    let attrAdd = '';
                    const [align, type] = typeAlign.split(' ');

                    switch (align) {
                        case 'inline':
                            if (
                                !this.options.maxLength ||
                                (
                                    attrLine.replace('\n', '') +
                                    (count > 1 ? ' ' : '') +
                                    attrCurrent +
                                    (index === array.length - 1 ? '>' : '')
                                ).length < this.options.maxLength ||
                                type === undefined
                            ) {
                                attrAdd = ' ';
                                count++;
                            } else {
                                switch (type) {
                                    case 'space':
                                        attrAdd = `\n${this._getSpacing(lvl + 1)}`;
                                        break;
                                    case 'alignTag':
                                        attrAdd = `\n${this._getSpacing(lvl, 1)}`;
                                        break;
                                    case 'alignFirstAttr':
                                        attrAdd = `\n${this._getSpacing(lvl, json.tag.length + 2)}`;
                                        break;
                                }
                                attrLine = '';
                                count = 1;
                            }
                            break;
                        case 'space':
                            attrAdd =
                                string && this.options.indent && this._hasMultiline()
                                    ? `\n${this._getSpacing(lvl + 1)}`
                                    : ' ';
                            break;
                        case 'alignTag':
                            attrAdd =
                                string && this.options.indent && this._hasMultiline()
                                    ? `\n${this._getSpacing(lvl, 1)}`
                                    : ' ';
                            break;
                        case 'alignFirstAttr':
                            attrAdd =
                                string && this.options.indent && this._hasMultiline()
                                    ? `\n${this._getSpacing(lvl, json.tag.length + 2)}`
                                    : ' ';
                            break;
                        case 'prettier':
                            attrAdd =
                                this.options.indent && this._hasMultiline() ? `\n${this._getSpacing(lvl + 1)}` : ' ';
                            break;
                    }
                    attr = attrAdd + attrCurrent;
                    attrLine += attr;
                    string += attr;
                }
            });

            switch (typeAlign) {
                case 'prettier':
                    string += this.options.indent && this._hasMultiline() ? `\n${this._getSpacing(lvl)}` : ' ';
                    break;
            }
        }
        return string;
    }

    /**
     * tag body generation
     * @param lvl level node
     * @param json node data
     * @param inline force inline
     * @returns render of body
     */
    private _generateBody(lvl: number, json: Json2htmlRef, inline: boolean) {
        let string = '';
        if (json.body) {
            if (!Array.isArray(json.body)) {
                string += this._generateBodyElement(lvl, json.body, true, inline);
            } else {
                json.body.forEach(element => {
                    string += this._generateBodyElement(lvl, element, false, inline);
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
     * @param inline force inline
     * @returns render of body
     */
    private _generateBodyElement(
        lvl: number,
        element: Json2htmlRef | string,
        onlyOne: boolean,
        inline: boolean = false,
    ): string {
        let string = '';
        if (this._hasMultiline() && !inline) {
            string += `\n${this._getSpacing(lvl + 1)}`;
        }

        // in XML mode, for generate a valid XML structure
        if (!onlyOne && this._modeXML() && typeof element === 'string') {
            element = {
                tag: this.options.xmlDefaultTag,
                body: element,
            };
        }

        string +=
            typeof element === 'string'
                ? this._formatText(lvl + 1, element, inline)
                : this._generate(lvl + 1, element, inline);
        return string;
    }

    /**
     * formated string
     * @param lvl level node
     * @param string text
     * @param inline inline
     * @returns render of string
     */
    private _formatText(lvl: number, string: string, inline: boolean = false): string {
        let formatedText = '';
        const space = this._getSpacing(lvl);
        if (!inline && this.options.maxLength) {
            const list = string.split('\n');
            for (const line of list) {
                let lineBuild = '';
                if ((space + line).length > this.options.maxLength) {
                    const frags = line.split(' ');
                    for (const frag of frags) {
                        if ((space + lineBuild + (lineBuild ? ' ' : '') + frag).length < this.options.maxLength) {
                            lineBuild += (lineBuild ? ' ' : '') + frag;
                        } else {
                            formatedText += (formatedText ? '\n' + space : '') + lineBuild;
                            lineBuild = frag;
                        }
                    }
                }
                formatedText += (formatedText ? '\n' + space : '') + (lineBuild || line);
            }
        }
        return formatedText || string;
    }

    /**
     * if multiline rendering
     */
    private _hasMultiline(): boolean {
        return this.options.formatting === 'multiline';
    }

    /**
     * if multiline rendering
     */
    private _modeXML(): boolean {
        return this.options.type === 'xml';
    }

    /**
     * calculating the number of spaces for indentation
     * @param lvl level
     * @param addition space of space (only space, no tabulation)
     * @returns space
     */
    private _getSpacing(lvl: number, addition: number = 0): string {
        return this.options.indent
            ? (this.options.spaceType === 'space' ? ' ' : '\t').repeat(
                  (lvl + +this.options.spaceBase) * +this.options.spaceLength,
              ) + ' '.repeat(addition)
            : '';
    }
}
