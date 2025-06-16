export interface Json2htmlAttr {
    [key: string]: string | string[] | number | number[] | null | undefined;
}

export type Json2htmlObject =
    | Json2htmlRef
    | Json2annotationRef
    | Json2annotationValue
    | (
          | Json2htmlRef
          | Json2annotationRef
          | Json2annotationValue
          | Json2CommentRef
          | Json2CdataRef
          | Json2DoctypeRef
          | Json2XmlRef
          | Json2EmptyLine
      )[];
export type Json2htmlBody =
    | (
          | Json2htmlRef
          | Json2annotationRef
          | Json2annotationValue
          | Json2CommentRef
          | Json2CdataRef
          | Json2EmptyLine
          | string
      )[]
    | Json2htmlRef
    | Json2annotationRef
    | Json2annotationValue
    | Json2CommentRef
    | Json2CdataRef
    | Json2EmptyLine
    | string;

export interface Json2htmlRef {
    /** tag name */
    tag: string;
    /** attributes */
    attrs?: Json2htmlAttr;
    /** content of tag */
    body?: Json2htmlBody;
    /** override formatting option for this element and these children */
    inline?: boolean;
    /** ignore body and end tag for standard tag (see : optionalEndTags) */
    autoClose?: boolean;
    /** only for web component: if no body → no end tag (web component:tag with a `-` in their name).\
     * Note: override global option with same name, only for this tag */
    webComponentAutoClose?: boolean;
}

export interface Json2annotationRef {
    /** annotation name */
    annotation: string;
    /** conditional */
    conditional?: string;
    /** content of annotation */
    body?: Json2htmlBody;
    /** attached to the previous annotation */
    attached: boolean;
}

export interface Json2annotationValue {
    /** annotation name */
    annotation: string;
    /** annotation value */
    value?: string;
}

export interface Json2DoctypeRef {
    /** doctype content */
    doctype: string;
}

export interface Json2XmlRef {
    /** <?xml?> attributes */
    xmlAttrs: Json2htmlAttr;
    /** inline : override formatting option for this element and these children */
    inline?: boolean;
}

export interface Json2CommentRef {
    /** comment value */
    comment: string;
}

export interface Json2CdataRef {
    /** comment value */
    cdata: string;
}

export interface Json2EmptyLine {
    /** Add empty line(s) */
    emptyLine: null | number;
}

export interface Json2htmlOptions {
    /**
     * format of the rendered structure:
     * * `inline`: all on one line without space
     * * `multiline`: structure on several lines with possible indentation
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
    /** add a space before `/` (ex. true = `<br />`, false = `<br/>`)*/
    spaceBeforeSlash?: boolean;
    /** only for web component: if no body → no end tag (web component:tag with a `-` in their name) */
    webComponentAutoClose?: boolean;
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
        spaceBeforeSlash: true,
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
     * @param option formatting options
     */
    constructor(
        public json: Json2htmlObject,
        option: Json2htmlOptions = {},
    ) {
        Object.assign(this.options, option);
    }

    /**
     * rendering in string
     */
    toString() {
        let html = '';
        const inline = this.options.formatting === 'inline';
        if (!Array.isArray(this.json)) {
            if ('annotation' in this.json) {
                html = `${this._getSpacing(0)}${this._generateAnnotation(0, this.json, inline)}`;
            } else {
                html = `${this._getSpacing(0)}${this._generateTag(0, this.json, inline)}`;
            }
        } else {
            this.json.forEach((element, index) => {
                const spacing = `${index > 0 && !inline ? '\n' : ''}${this._getSpacing(0)}`;
                if ('doctype' in element) {
                    html += `${spacing}<!doctype ${element.doctype}>`;
                } else if ('xmlAttrs' in element) {
                    html += `${spacing}${this._generateXmlAttr(0, element, inline)}`;
                } else if ('cdata' in element) {
                    html += `${spacing}<![CDATA[${element.cdata}]]>`;
                } else if ('comment' in element) {
                    html += `${spacing}<!-- ${element.comment} -->`;
                } else if ('annotation' in element) {
                    html += `${
                        this.json[index]?.attached ? ' ' : spacing
                    }${this._generateAnnotation(0, element, inline)}`;
                } else if ('emptyLine' in element) {
                    html += `${this._getSpacing(0)}${
                        inline
                            ? ''
                            : '\n'.repeat(
                                  +element.emptyLine && +element.emptyLine > 1
                                      ? +element.emptyLine - (index === 0 ? 1 : 0)
                                      : index === 0
                                        ? 0
                                        : 1,
                              )
                    }`;
                } else {
                    html += `${spacing}${this._generateTag(0, element, inline)}`;
                }
            });
        }
        return html;
    }

    /**
     * Generate Angular annotation(`@`) template
     * @param lvl node level
     * @param json node data
     * @param inline force inline
     * @returns render of node
     */
    private _generateAnnotation(lvl: number, json: Json2annotationRef | Json2annotationValue, inline: boolean = false) {
        if ('value' in json) {
            return `@${json.annotation} ${json.value};`;
        } else {
            let string = `@${json.annotation}${'conditional' in json ? ` (${json.conditional})` : ``} \{`;

            let tagContent = this._generateBody(lvl, json as Json2annotationRef, inline);
            if (tagContent && this._hasMultiline() && !inline) {
                tagContent = `${tagContent}\n${this._getSpacing(lvl)}`;
            }
            string += tagContent;
            string += `}`;
            return string;
        }
    }

    /**
     *  Generate XML special tag `<?xml ?>`
     * @param lvl node level
     * @param json node data
     * @param inline force inline
     * @returns render of node
     */
    private _generateXmlAttr(lvl: number, json: Json2XmlRef, inline: boolean = false) {
        return `<?xml${this._generateAttrs(
            lvl,
            {
                tag: '?xml',
                attrs: json.xmlAttrs,
            },
            inline || json.inline,
        )}?>`;
    }

    /**
     * generation in string for a node (tag with attributes and content)
     * @param lvl node level
     * @param json node data
     * @param inline force inline
     * @returns render of node
     */
    private _generateTag(lvl: number, json: Json2htmlRef, inline: boolean = false): string {
        const hasContent = !this.options.noContentTags.includes(json.tag.toLowerCase());
        const hasWebComponentBody =
            (!json.body || !(json.body as []).length) &&
            ((this.options.webComponentAutoClose && json.webComponentAutoClose === undefined) ||
                json.webComponentAutoClose) &&
            json.tag.includes('-');
        const content = this._generateAttrs(lvl, json, inline || json.inline);

        const xmlAutoClose =
            ((!hasContent || json.autoClose) && this._modeXML()) || hasWebComponentBody
                ? `${
                      this.options.spaceBeforeSlash && (content || !content[content.length - 1].match(/\s|\n/))
                          ? ' '
                          : ''
                  }/`
                : '';

        let string = `<${json.tag}${content}${xmlAutoClose}>`;
        if (hasContent && !json.autoClose && !hasWebComponentBody) {
            let tagContent = this._generateBody(lvl, json, inline || json.inline);
            if (tagContent && this._hasMultiline() && !(inline || json.inline)) {
                tagContent = `${tagContent}\n${this._getSpacing(lvl)}`;
            }
            string += tagContent;
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
                const v = attrs[id];
                const values = !Array.isArray(v) ? [v] : v;
                for (const value of values) {
                    if (value !== undefined) {
                        const attrCurrent = `${id}${
                            value !== null || value ? `="${String(value).replace(/"/g, '&quote;')}"` : ''
                        }`;

                        let attr = '';
                        let attrAdd = '';
                        const [align, type] = typeAlign.split(' ');

                        switch (align) {
                            case 'inline':
                                if (
                                    !this.options.maxLength ||
                                    (
                                        attrLine.replace(/\n/g, '') +
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
                                    this.options.indent && this._hasMultiline()
                                        ? `\n${this._getSpacing(lvl + 1)}`
                                        : ' ';
                                break;
                        }
                        attr = attrAdd + attrCurrent;
                        attrLine += attr;
                        string += attr;
                    }
                }
            });

            if (typeAlign === 'prettier') {
                string += this.options.indent && this._hasMultiline() ? `\n${this._getSpacing(lvl)}` : ' ';
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
    private _generateBody(
        lvl: number,
        json: Json2htmlRef | Json2annotationRef | Json2CommentRef | Json2CdataRef | Json2EmptyLine,
        inline: boolean,
    ) {
        let string = '';
        if ('cdata' in json) {
            return `${this._getSpacing(0)}<![CDATA[${json.cdata}]]>`;
        } else if ('comment' in json) {
            return `${this._getSpacing(0)}<!-- ${json.comment} -->`;
        } else if ('emptyLine' in json) {
            return `${this._getSpacing(0)}${this.emptyLines(json, inline)}`;
        } else if ('body' in json) {
            if (!Array.isArray(json.body)) {
                string += this._generateBodyElement(lvl, json.body, true, inline);
            } else {
                json.body.forEach((element, index) => {
                    let attached = false;
                    if (
                        typeof element === 'object' &&
                        'attached' in element &&
                        json.body[index - 1] &&
                        'annotation' in json.body[index - 1] &&
                        !('value' in json.body[index - 1])
                    ) {
                        attached = element.attached;
                    }

                    string += this._generateBodyElement(lvl, element, false, inline, attached);
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
     * @param attached attache to the previous element (for annotation)
     * @returns render of body
     */
    private _generateBodyElement(
        lvl: number,
        element:
            | Json2htmlRef
            | Json2annotationRef
            | Json2annotationValue
            | Json2CommentRef
            | Json2CdataRef
            | Json2EmptyLine
            | string,
        onlyOne: boolean,
        inline: boolean = false,
        attached: boolean = false,
    ): string {
        let string = '';
        if (attached) {
            string += ' ';
        } else if (this._hasMultiline() && !inline) {
            string += `\n${this._getSpacing(lvl + 1)}`;
        }

        // in XML mode, for generate a valid XML structure
        if (!onlyOne && this._modeXML() && typeof element === 'string') {
            element = {
                tag: this.options.xmlDefaultTag,
                body: element,
            };
        }

        if (typeof element === 'string') {
            string += this._formatText(lvl + 1, element, inline);
        } else if ('annotation' in element) {
            string += this._generateAnnotation(lvl + 1, element, inline);
        } else if ('cdata' in element) {
            string += `${this._getSpacing(0)}<![CDATA[${element.cdata}]]>`;
        } else if ('comment' in element) {
            string += `${this._getSpacing(0)}<!-- ${element.comment} -->`;
        } else if ('emptyLine' in element) {
            return `${this._getSpacing(0)}${this.emptyLines(element, inline)}`;
        } else {
            string += this._generateTag(lvl + 1, element, inline);
        }

        return string;
    }

    /**
     * formatted string
     * @param lvl level node
     * @param string text
     * @param inline inline
     * @returns render of string
     */
    private _formatText(lvl: number, string: string, inline: boolean = false): string {
        let formattedText = '';
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
                            formattedText += (formattedText ? '\n' + space : '') + lineBuild;
                            lineBuild = frag;
                        }
                    }
                }
                formattedText += (formattedText ? '\n' + space : '') + (lineBuild || line);
            }
        }
        return formattedText || string;
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

    /**
     * add empty lines
     * @param lines infos
     * @params inline inline
     * @returns empty lines
     */
    private emptyLines(element: Json2EmptyLine, inline: boolean): string {
        return inline ? '' : '\n'.repeat(+element.emptyLine && +element.emptyLine > 1 ? +element.emptyLine : 1);
    }
}
