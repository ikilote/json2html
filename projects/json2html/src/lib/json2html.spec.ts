import { Json2html } from './json2html';

describe('Json2html', () => {
    describe('Basic Tag Rendering', () => {
        it('should render a simple tag', () => {
            const json = { tag: 'div', body: 'Hello World' };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<div>
    Hello World
</div>`);
        });

        it('should render a tag with no body', () => {
            const json = { tag: 'br' };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<br>`);
        });
    });

    describe('Attribute Rendering', () => {
        it('should render attributes correctly', () => {
            const json = { tag: 'div', attrs: { class: 'container', id: 'main' } };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<div class="container"\n     id="main"></div>`);
        });

        it('should render a self-closing tag', () => {
            const json = { tag: 'img', attrs: { src: 'image.png', alt: 'Image' } };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<img src="image.png"\n     alt="Image">`);
        });

        it('should render a self-closing tag inline', () => {
            const json = { tag: 'img', attrs: { src: 'image.png', alt: 'Image' }, inline: true };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<img src="image.png" alt="Image">`);
        });

        it('should render a self-closing tag inline option', () => {
            const json = { tag: 'img', attrs: { src: 'image.png', alt: 'Image' } };
            const html = new Json2html(json, { formatting: 'inline', type: 'xml' }).toString();
            expect(html).toBe(`<img src="image.png" alt="Image" />`);
        });

        it('should render a self-closing tag inline option (body)', () => {
            const json = { tag: 'img', attrs: { src: 'image.png' }, body: 'body' };
            const html = new Json2html(json, { formatting: 'inline' }).toString();
            expect(html).toBe(`<img src="image.png">`);
        });

        it('should handle null/undefined attributes', () => {
            const json = { tag: 'div', attrs: { class: null, id: undefined, role: 'main' } };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<div class\n     role="main"></div>`);
        });
    });

    describe('Annotation Rendering', () => {
        it('should render a simple annotation', () => {
            const json = { annotation: 'let', value: 'selector = "app-root"' };
            const html = new Json2html(json).toString();
            expect(html).toBe(`@let selector = "app-root";`);
        });

        it('should handle annotations', () => {
            const json = { annotation: 'Component', body: [{ tag: 'div' }] };
            const html = new Json2html(json).toString();
            expect(html).toBe(`@Component {
    <div></div>
}`);
        });

        it('should render a conditional annotation', () => {
            const json = { annotation: 'If', conditional: 'true', body: [{ tag: 'div' }] };
            const html = new Json2html(json).toString();
            expect(html).toBe(`@If (true) {
    <div></div>
}`);
        });
    });

    describe('Formatting Options', () => {
        it('should render inline formatting', () => {
            const json = { tag: 'div', body: 'Hello' };
            const html = new Json2html(json, { formatting: 'inline' }).toString();
            expect(html).toBe(`<div>Hello</div>`);
        });

        it('should use custom indentation', () => {
            const json = { tag: 'div', body: 'Hello' };
            const html = new Json2html(json, { spaceLength: 2 }).toString();
            expect(html).toBe(`<div>
  Hello
</div>`);
        });

        it('should use custom indentation', () => {
            const json = { tag: 'div', body: ['Hello', { tag: 'div', body: 'World' }] };
            const html = new Json2html(json, { spaceLength: 2 }).toString();
            expect(html).toBe(`<div>
  Hello
  <div>
    World
  </div>
</div>`);
        });

        it('should render a self-closing tag inline option', () => {
            const json = { tag: 'img', attrs: { src: 'image.png', alt: 'Image' } };
            const html = new Json2html(json, { formatting: 'inline' }).toString();
            expect(html).toBe(`<img src="image.png" alt="Image">`);
        });

        it('should align attributes with tag', () => {
            const json = { tag: 'div', attrs: { class: 'container', id: 'main' } };
            const html = new Json2html(json, { attrPosition: 'alignTag' }).toString();
            expect(html).toBe(`<div class="container"
 id="main"></div>`);
        });
    });

    describe('Special Tags', () => {
        it('should render xml declaration', () => {
            const json = [{ xmlAttrs: { 'xml:test': 'test' } }];
            const html = new Json2html(json).toString();
            expect(html).toBe(`<?xml xml:test="test"?>`);
        });

        it('should render doctype declaration', () => {
            const json = [{ doctype: 'html' }];
            const html = new Json2html(json).toString();
            expect(html).toBe(`<!doctype html>`);
        });

        it('should render CDATA', () => {
            const json = [{ cdata: 'content' }];
            const html = new Json2html(json).toString();
            expect(html).toBe(`<![CDATA[content]]>`);
        });

        it('should render comments', () => {
            const json = [{ comment: 'This is a comment' }];
            const html = new Json2html(json).toString();
            expect(html).toBe(`<!-- This is a comment -->`);
        });

        it('should render multiple', () => {
            const json = [{ doctype: 'html' }, { comment: 'This is a comment' }];
            const html = new Json2html(json).toString();
            expect(html).toBe(`<!doctype html>
<!-- This is a comment -->`);
        });

        it('should render comments', () => {
            const json = [{ comment: 'This is a comment' }, { emptyLine: 2 }, { comment: 'This is a comment' }];
            const html = new Json2html(json).toString();
            expect(html).toBe(`<!-- This is a comment -->


<!-- This is a comment -->`);
        });
    });

    describe('Multi level', () => {
        it('should render a simple tag', () => {
            const json = { tag: 'div', body: { tag: 'p', body: 'Hello World' } };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<div>
    <p>
        Hello World
    </p>
</div>`);
        });

        it('should render a simple tag', () => {
            const json = {
                tag: 'div',
                body: {
                    tag: 'div',
                    body: { tag: 'div', body: { tag: 'div', body: { tag: 'p', body: 'Hello World' } } },
                },
            };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<div>
    <div>
        <div>
            <div>
                <p>
                    Hello World
                </p>
            </div>
        </div>
    </div>
</div>`);
        });

        it('should render a with comments and empty lines', () => {
            const json = {
                tag: 'div',
                body: [{ comment: 'This is a comment' }, { emptyLine: 2 }, { comment: 'This is a comment' }],
            };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<div>
    <!-- This is a comment -->


    <!-- This is a comment -->
</div>`);
        });

        it('should render a with comments and empty lines', () => {
            const json = {
                tag: 'div',
                body: [{ comment: 'This is a comment' }, { emptyLine: 2 }, { comment: 'This is a comment' }],
            };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<div>
    <!-- This is a comment -->


    <!-- This is a comment -->
</div>`);
        });
    });

    describe('Advanced Attribute Formatting & Position', () => {
        const complexAttrs = {
            tag: 'div',
            attrs: { id: 'main', class: 'container', 'data-test': 'value', role: 'button' },
        };
        const complexAttrs2 = {
            tag: 'body',
            body: {
                tag: 'figure',
                attrs: {
                    class: null,
                    role: 'main',
                    datalist: 'test',
                    style: 'margin: 40px; test-align: center',
                    'data-group': 'main',
                    'data-item': 'test',
                },
            },
        };

        it('should format attributes with "prettier" style', () => {
            const html = new Json2html(complexAttrs, {
                attrPosition: 'prettier',
                indent: true,
            }).toString();

            expect(html).toBe(`<div
    id="main"
    class="container"
    data-test="value"
    role="button"
></div>`);
        });

        it('should format attributes with "prettier" style ans indent false', () => {
            const html = new Json2html(complexAttrs2, {
                attrPosition: 'prettier',
                indent: false,
            }).toString();

            expect(html).toBe(`<body>
<figure class role="main" datalist="test" style="margin: 40px; test-align: center" data-group="main" data-item="test" ></figure>
</body>`);
        });

        it('should handle "inline space" alignment', () => {
            const html = new Json2html(complexAttrs, {
                attrPosition: 'inline space',
                maxLength: 20, // Force wrap
            }).toString();
            expect(html).toBe(`<div id="main"
    class="container"
    data-test="value"
    role="button"></div>`);
        });

        it('should handle null/undefined attributes', () => {
            const json = { tag: 'body', body: { tag: 'div', attrs: { class: null, role: 'main', datalist: 'test' } } };
            const html = new Json2html(json, { attrPosition: 'alignTag' }).toString();
            expect(html).toBe(`<body>
    <div class
     role="main"
     datalist="test"></div>
</body>`);
        });

        it('should handle "alignFirstAttr" alignment (div)', () => {
            const json = { tag: 'body', body: { tag: 'div', attrs: { class: null, role: 'main', datalist: 'test' } } };
            const html = new Json2html(json, { attrPosition: 'alignFirstAttr' }).toString();
            expect(html).toBe(`<body>
    <div class
         role="main"
         datalist="test"></div>
</body>`);
        });

        it('should handle "alignFirstAttr" alignment (figure)', () => {
            const json = {
                tag: 'body',
                body: { tag: 'figure', attrs: { class: null, role: 'main', datalist: 'test' } },
            };
            const html = new Json2html(json, { attrPosition: 'alignFirstAttr' }).toString();
            expect(html).toBe(`<body>
    <figure class
            role="main"
            datalist="test"></figure>
</body>`);
        });

        it('should handle "space" alignment', () => {
            const json = {
                tag: 'body',
                body: { tag: 'figure', attrs: { class: null, role: 'main', datalist: 'test' } },
            };
            const html = new Json2html(json, { attrPosition: 'space' }).toString();
            expect(html).toBe(`<body>
    <figure class
        role="main"
        datalist="test"></figure>
</body>`);
        });

        it('should handle "inline space" alignment', () => {
            const html = new Json2html(complexAttrs2, { attrPosition: 'inline space' }).toString();
            expect(html).toBe(`<body>
    <figure class role="main" datalist="test" style="margin: 40px; test-align: center" data-group="main" data-item="test"></figure>
</body>`);
        });

        it('should handle "inline space" alignment with maxLength:80', () => {
            const html = new Json2html(complexAttrs2, { attrPosition: 'inline space', maxLength: 80 }).toString();
            expect(html).toBe(`<body>
    <figure class role="main" datalist="test"
        style="margin: 40px; test-align: center" data-group="main"
        data-item="test"></figure>
</body>`);
        });

        it('should handle "inline alignTag" alignment', () => {
            const html = new Json2html(complexAttrs2, { attrPosition: 'inline alignTag' }).toString();
            expect(html).toBe(`<body>
    <figure class role="main" datalist="test" style="margin: 40px; test-align: center" data-group="main" data-item="test"></figure>
</body>`);
        });

        it('should handle "inline alignTag" alignment with maxLength:80', () => {
            const html = new Json2html(complexAttrs2, { attrPosition: 'inline alignTag', maxLength: 80 }).toString();
            expect(html).toBe(`<body>
    <figure class role="main" datalist="test"
     style="margin: 40px; test-align: center" data-group="main"
     data-item="test"></figure>
</body>`);
        });

        it('should handle "inline alignFirstAttr" alignment', () => {
            const html = new Json2html(complexAttrs2, { attrPosition: 'inline alignFirstAttr' }).toString();
            expect(html).toBe(`<body>
    <figure class role="main" datalist="test" style="margin: 40px; test-align: center" data-group="main" data-item="test"></figure>
</body>`);
        });

        it('should handle "inline alignFirstAttr" alignment with maxLength:80', () => {
            const html = new Json2html(complexAttrs2, {
                attrPosition: 'inline alignFirstAttr',
                maxLength: 80,
            }).toString();
            expect(html).toBe(`<body>
    <figure class role="main" datalist="test"
            style="margin: 40px; test-align: center" data-group="main"
            data-item="test"></figure>
</body>`);
        });

        it('should handle array of attributes', () => {
            const json = { tag: 'div', attrs: { test: ['btn', 'btn-primary'] } };
            const html = new Json2html(json).toString();

            expect(html).toBe('<div test="btn" test="btn-primary"></div>');
        });

        it('should handle boolean attributes (true/null)', () => {
            const json = { tag: 'input', attrs: { required: true, disabled: null, type: 'text' } };
            const html = new Json2html(json, { formatting: 'inline' }).toString();

            expect(html).toBe('<input required="true" disabled type="text">');
        });

        it('should handle parameter with wrapAttrNumber (superior)', () => {
            const html = new Json2html(complexAttrs, {
                attrPosition: 'alignFirstAttr',
                wrapAttrNumber: 5,
            }).toString();
            expect(html).toBe(`<div id="main" class="container" data-test="value" role="button"></div>`);
        });

        it('should handle parameter with wrapAttrNumber (inferior)', () => {
            const html = new Json2html(complexAttrs, {
                attrPosition: 'alignFirstAttr',
                wrapAttrNumber: 3,
            }).toString();
            expect(html).toBe(`<div id="main"
     class="container"
     data-test="value"
     role="button"></div>`);
        });

        it('should handle parameter with wrapAttrNumber (edge value)', () => {
            const html = new Json2html(complexAttrs, {
                attrPosition: 'alignFirstAttr',
                wrapAttrNumber: undefined,
            }).toString();
            expect(html).toBe(`<div id="main"
     class="container"
     data-test="value"
     role="button"></div>`);
        });
    });

    describe('Text Formatting & MaxLength', () => {
        const longText1 = 'This is a very long text that should be wrapped because it exceeds the limit';
        const longText2 =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

        it('should wrap long text when maxLength is set', () => {
            const longText = longText1;
            const json = { tag: 'p', body: longText };
            const html = new Json2html(json, {
                maxLength: 20,
                formatting: 'multiline',
            }).toString();

            expect(html).toBe(`<p>
    This is a very
    long text that
    should be
    wrapped because
    it exceeds the
    limit
</p>`);
        });

        it('should wrap long text when no maxLength is set', () => {
            const json = {
                tag: 'div',
                body: longText2,
            };
            const html = new Json2html(json).toString();

            expect(html).toBe(`<div>\n    ${longText2}\n</div>`);
        });

        it('should wrap long text when maxLength is set (2)', () => {
            const json = {
                tag: 'div',
                body: longText2,
            };
            const html = new Json2html(json, { maxLength: 80 }).toString();

            expect(html).toBe(`<div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.
</div>`);
        });

        it('should wrap multi texts when maxLength is set', () => {
            const json = {
                tag: 'div',
                body: [longText2, ''],
            };
            const html = new Json2html(json, { maxLength: 80 }).toString();

            expect(html).toBe(`<div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.\n    \n</div>`);
        });

        it('should wrap multi texts when maxLength is set', () => {
            const json = {
                tag: 'div',
                body: [longText2, longText1],
            };
            const html = new Json2html(json, { maxLength: 80 }).toString();

            expect(html).toBe(`<div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.
    This is a very long text that should be wrapped because it exceeds the limit
</div>`);
        });
    });

    describe('HTML Specific Options', () => {
        it('should remove optional end tags if enabled', () => {
            const json = {
                tag: 'ul',
                body: [
                    { tag: 'li', body: 'Item 1' },
                    { tag: 'li', body: 'Item 2' },
                ],
            };
            const html = new Json2html(json, { removeOptionalEndTags: true }).toString();

            expect(html).toBe(`<ul>
    <li>
        Item 1
    <li>
        Item 2
</ul>`);
        });

        it('should respect webComponentSelfClosing option globally', () => {
            const json = { tag: 'my-icon', attrs: { icon: 'user' } };
            const html = new Json2html(json, { webComponentSelfClosing: true }).toString();

            expect(html).toBe('<my-icon icon="user" />');
        });

        it('should respect webComponentSelfClosing option globally', () => {
            const json = { tag: 'my-card', attrs: { icon: 'user' }, body: { tag: 'my-icon', attrs: { icon: 'user' } } };
            const html = new Json2html(json, { webComponentSelfClosing: true }).toString();

            expect(html).toBe('<my-card icon="user">\n    <my-icon icon="user" />\n</my-card>');
        });

        it('should NOT self-close web component if body is present', () => {
            const json = { tag: 'my-card', body: 'Content' };
            const html = new Json2html(json, { webComponentSelfClosing: true }).toString();
            expect(html).toBe(`<my-card>\n    Content\n</my-card>`);
        });
    });

    describe('XML Specific Logic', () => {
        it('should use xmlDefaultTag for orphan text strings when no orphan', () => {
            const json = { tag: 'root', body: 'Just Text' };
            const html = new Json2html(json, {
                type: 'xml',
                xmlDefaultTag: 'textNode',
            }).toString();

            expect(html).toContain('<root>\n    Just Text\n</root>');
        });

        it('should use default xmlDefaultTag for orphan text strings', () => {
            const json = { tag: 'root', body: ['Just Text', { tag: 'subText', body: 'Sub Text' }] };
            const html = new Json2html(json, {
                type: 'xml',
            }).toString();

            expect(html).toContain(
                '<root>\n    <span>\n        Just Text\n    </span>\n    <subText>\n        Sub Text\n    </subText>\n</root>',
            );
        });

        it('should use xmlDefaultTag for orphan text strings', () => {
            const json = { tag: 'root', body: ['Just Text', { tag: 'subText', body: 'Sub Text' }] };
            const html = new Json2html(json, {
                type: 'xml',
                xmlDefaultTag: 'textNode',
            }).toString();

            expect(html).toContain(
                '<root>\n    <textNode>\n        Just Text\n    </textNode>\n    <subText>\n        Sub Text\n    </subText>\n</root>',
            );
        });

        it('should remove space before slash if configured', () => {
            const json = { tag: 'br' };
            const html = new Json2html(json, { spaceBeforeSlash: false, type: 'xml' }).toString();
            expect(html).toBe('<br/>');
        });
    });

    describe('Advanced Annotations (Attached)', () => {
        it('should render attached annotations (If/Else)', () => {
            const json = [
                { annotation: 'if', conditional: 'isAdmin', body: [{ tag: 'div', body: 'Admin' }] },
                { annotation: 'else', body: [{ tag: 'div', body: 'User' }], attached: true },
            ];
            const html = new Json2html(json).toString();

            expect(html).toBe(`@if (isAdmin) {
    <div>
        Admin
    </div>
} @else {
    <div>
        User
    </div>
}`);
        });

        it('should render attached annotations (If/Elseif/Else)', () => {
            const json = [
                { annotation: 'if', conditional: 'isAdmin', body: [{ tag: 'div', body: 'Admin' }] },
                {
                    annotation: 'elseif',
                    conditional: 'isMembre',
                    body: [{ tag: 'div', body: 'Member' }],
                    attached: true,
                },
                { annotation: 'else', body: [{ tag: 'div', body: 'User' }], attached: true },
            ];
            const html = new Json2html(json).toString();

            expect(html).toBe(`@if (isAdmin) {
    <div>
        Admin
    </div>
} @elseif (isMembre) {
    <div>
        Member
    </div>
} @else {
    <div>
        User
    </div>
}`);
        });

        it('should render attached annotations (Switch)', () => {
            const json = {
                annotation: 'switch',
                conditional: 'a',
                body: [
                    {
                        annotation: 'case',
                        conditional: 'caseA',
                        body: 'Value A',
                    },
                    {
                        annotation: 'case',
                        conditional: 'caseB',
                        body: 'Value B',
                    },
                    {
                        annotation: 'default',
                        body: 'Default',
                    },
                ],
            };
            const html = new Json2html(json).toString();

            expect(html).toBe(`@switch (a) {
    @case (caseA) {
        Value A
    }
    @case (caseB) {
        Value B
    }
    @default {
        Default
    }
}`);
        });

        it('should render attached annotations (Switch)', () => {
            const json = {
                annotation: 'switch',
                conditional: 'a',
                body: [
                    {
                        annotation: 'case',
                        conditional: 'caseA',
                        body: 'Value A',
                    },
                    {
                        annotation: 'case',
                        conditional: 'caseB',
                        body: 'Value B',
                    },
                    {
                        annotation: 'default',
                        body: 'Default',
                    },
                ],
            };
            const html = new Json2html(json).toString();

            expect(html).toBe(`@switch (a) {
    @case (caseA) {
        Value A
    }
    @case (caseB) {
        Value B
    }
    @default {
        Default
    }
}`);
        });

        it('should render with nested annotations', () => {
            const json = {
                annotation: 'if',
                conditional: 'a',
                body: [
                    {
                        annotation: 'if',
                        conditional: 'b',
                        body: 'Value A',
                    },
                    {
                        annotation: 'else',
                        body: 'Value B',
                        attached: true,
                    },
                ],
            };
            const html = new Json2html(json).toString();

            expect(html).toBe(`@if (a) {
    @if (b) {
        Value A
    } @else {
        Value B
    }
}`);
        });

        it('should render attached annotations (mix contents)', () => {
            const json = [
                {
                    tag: 'div',
                    attrs: { id: 'test2', class: 'foobar', '(click)': ['action1()', 'action2()'] },
                    body: 'test',
                },
                {
                    annotation: 'let',
                    value: 'a = "2"',
                },
                {
                    annotation: 'if',
                    conditional: 'a === "1"',
                    body: {
                        tag: 'a',
                        attrs: { href: 'https://example.com' },
                        body: 'lien',
                    },
                },
                {
                    annotation: 'else',
                    body: {
                        tag: 'a',
                        attrs: { href: 'https://test.com' },
                        body: 'lien',
                    },
                    attached: true,
                },
            ];
            const html = new Json2html(json).toString();

            expect(html).toBe(`<div id="test2"
     class="foobar"
     (click)="action1()"
     (click)="action2()">
    test
</div>
@let a = "2";
@if (a === "1") {
    <a href="https://example.com">
        lien
    </a>
} @else {
    <a href="https://test.com">
        lien
    </a>
}`);
        });
    });

    describe('Indentation Options', () => {
        it('should handle tab indentation', () => {
            const json = { tag: 'div', body: { tag: 'span', body: 'Hi' } };
            const html = new Json2html(json, { spaceType: 'tab', spaceLength: 1 }).toString();

            expect(html).toBe(`<div>\n\t<span>\n\t\tHi\n\t</span>\n</div>`);
        });

        it('should handle space length indentation', () => {
            const json = { tag: 'div', body: { tag: 'span', body: 'Hi' } };
            const html = new Json2html(json, { spaceLength: 1 }).toString();

            expect(html).toBe(`<div>\n <span>\n  Hi\n </span>\n</div>`);
        });

        it('should disable indentation completely', () => {
            const json = { tag: 'div', body: { tag: 'span', body: 'Hi' } };
            const html = new Json2html(json, { indent: false }).toString();

            expect(html).toBe(`<div>\n<span>\nHi\n</span>\n</div>`);
        });
    });

    describe('Complex Body Logic (Attached & Recursion)', () => {
        it('should handle "attached" property safely on the first element', () => {
            const json = {
                tag: 'div',
                body: [{ annotation: 'else', attached: true, body: 'content' }],
            };
            const html = new Json2html(json).toString();

            expect(html).toBe(`<div>
    @else {
        content
    }
</div>`);
        });

        it('should NOT attach if previous element is NOT an annotation', () => {
            const json = {
                tag: 'div',
                body: [
                    { tag: 'span', body: 'text' },
                    { annotation: 'else', attached: true, body: 'content' },
                ],
            };
            const html = new Json2html(json).toString();

            expect(html).toBe(`<div>
    <span>
        text
    </span>
    @else {
        content
    }
</div>`);
        });

        it('should NOT attach if previous annotation is a value annotation', () => {
            const json = {
                tag: 'div',
                body: [
                    { annotation: 'let', value: 'x = 1' },
                    { annotation: 'else', attached: true, body: 'content' },
                ],
            };
            const html = new Json2html(json).toString();

            expect(html).toBe(`<div>
    @let x = 1;
    @else {
        content
    }
</div>`);
        });

        it('should attach correctly if previous is a block annotation', () => {
            const json = [
                { annotation: 'if', conditional: 'cond', body: 'A' },
                { annotation: 'else', attached: true, body: 'B' },
            ];
            const html = new Json2html(json).toString();

            expect(html).toBe(`@if (cond) {\n    A\n} @else {\n    B\n}`);
        });
    });

    describe('Comment', () => {
        it('should handle direct comment structure passing through root generation', () => {
            const weirdJson = {
                comment: 'comment',
            };
            const html = new Json2html(weirdJson).toString();
            expect(html).toContain(`<!-- comment -->`);
        });

        it('should handle direct comment structure passing through body generation', () => {
            const weirdJson = {
                tag: 'div',
                body: { comment: 'comment' },
            };
            const html = new Json2html(weirdJson).toString();
            expect(html).toBe(`<div>\n    <!-- comment -->\n</div>`);
        });
    });

    describe('CDATA', () => {
        it('should handle direct CDATA structure passing through body generation', () => {
            const weirdJson = {
                tag: 'div',
                body: { cdata: 'Direct CDATA' },
            };
            const html = new Json2html(weirdJson).toString();
            expect(html).toBe(`<div>\n    <![CDATA[Direct CDATA]]>\n</div>`);
        });

        it('should handle direct CDATA structure passing through root generation', () => {
            const weirdJson = {
                cdata: 'Direct CDATA',
            };
            const html = new Json2html(weirdJson).toString();
            expect(html).toContain(`<![CDATA[Direct CDATA]]>`);
        });
    });

    describe('EmptyLine', () => {
        it('should handle direct EmptyLine passing through body generation', () => {
            const json = {
                tag: 'div',
                body: { emptyLine: 2 },
            };
            const html = new Json2html(json).toString();

            expect(html).toBe('<div>\n\n\n</div>');
        });

        it('should handle direct EmptyLine passing through root generation', () => {
            const json = {
                emptyLine: 2,
            };
            const html = new Json2html(json).toString();

            expect(html).toBe('\n\n');
        });

        it('should handle direct EmptyLine passing through root generation (0 line)', () => {
            const json = {
                emptyLine: 0, // ignore
            };
            const html = new Json2html(json).toString();

            expect(html).toBe('\n');
        });

        it('should handle direct EmptyLine passing through root generation with bad value', () => {
            const json = {
                emptyLine: -1, // bad value
            };
            const html = new Json2html(json).toString();

            expect(html).toBe('\n');
        });

        it('should handle direct EmptyLine has ignore with inline option', () => {
            const json = {
                tag: 'div',
                body: { emptyLine: 2 },
                inline: true,
            };
            const html = new Json2html(json).toString();

            expect(html).toBe('<div></div>');
        });

        it('should handle direct EmptyLine passing through root generation and hide block', () => {
            const json = {
                emptyLine: 45,
                hide: true,
            };
            const html = new Json2html(json).toString();

            expect(html).toBe('');
        });
    });
});
