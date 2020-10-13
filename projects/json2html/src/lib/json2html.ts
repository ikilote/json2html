
export interface Json2htmlAttr { [key: string]: string | number | undefined | null }

export interface Json2htmlRef {
    tag: string,
    attrs?: Json2htmlAttr,
    body?: (Json2htmlRef | string)[] | string
}

export interface Json2htmlOptions {
    spaceType?: 'space' | 'tab',
    spaceLength?: 4,
    spaceBase?: 0,
    maxLenght?: 0,
    attrPosition?: 'inline' | 'space' | 'alignTag' | 'alignFirst',
    type?: 'html' | 'xml'
}

export class Json2html {

    readonly options: Json2htmlOptions = {
        spaceType: 'space',
        spaceLength: 4,
        spaceBase: 0,
        maxLenght: 0,
        attrPosition: 'inline',
        type: 'html'
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
        let tag = `<${json.tag}${this._generateAttrs(lvl, json)}>${this._generateHtml(lvl, json)}</${json.tag}>`;

        return tag;
    }

    private _generateAttrs(lvl: number, json: Json2htmlRef) {
        let string = '';
        let attrs = json.attrs;
        if (json.attrs && Object.keys(json.attrs).length) {
            for (let id in json.attrs) {
                if (this.options.attrPosition === 'inline') {
                    string += ' '
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
                string += json.body;
            } else {
                json.body.forEach(element => {
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

}
