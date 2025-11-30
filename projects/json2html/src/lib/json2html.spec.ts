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
            expect(html).toBe(`<div class="container"
     id="main"></div>`);
        });

        it('should render a self-closing tag', () => {
            const json = { tag: 'img', attrs: { src: 'image.png', alt: 'Image' } };
            const html = new Json2html(json).toString();
            expect(html).toBe(`<img src="image.png"
     alt="Image">`);
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
            expect(html).toBe(`<div class
     role="main"></div>`);
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

        it('should format attributes with "prettier" style', () => {
            const html = new Json2html(complexAttrs, {
                attrPosition: 'prettier',
                indent: true,
            }).toString();

            expect(html).toContain(`div\n    id="main"\n    class="container"`);
        });

        it('should handle "inline space" alignment', () => {
            const html = new Json2html(complexAttrs, {
                attrPosition: 'inline space',
                maxLength: 20, // Force wrap
            }).toString();
            expect(html).toContain('div id="main"');
        });

        it('should handle array of attributes', () => {
            const json = { tag: 'div', attrs: { test: ['btn', 'btn-primary'] } };
            const html = new Json2html(json).toString();

            expect(html).toContain('test="btn"');
            expect(html).toContain('test="btn-primary"');
        });

        it('should handle boolean attributes (true/null)', () => {
            const json = { tag: 'input', attrs: { required: true, disabled: null, type: 'text' } };
            const html = new Json2html(json, { formatting: 'inline' }).toString();

            expect(html).toBe('<input required="true" disabled type="text">');
        });
    });

    describe('Text Formatting & MaxLength', () => {
        it('should wrap long text when maxLength is set', () => {
            const longText = 'This is a very long text that should be wrapped because it exceeds the limit';
            const json = { tag: 'p', body: longText };
            const html = new Json2html(json, {
                maxLength: 20,
                formatting: 'multiline',
            }).toString();

            expect(html).toContain('\n');
            const lines = html.split('\n');
            expect(lines.length).toBeGreaterThan(3);
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

            expect(html).toContain('<li>');
            expect(html).not.toContain('</li>');
            expect(html.replace('\t', '_')).toBe(`<ul>
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

            expect(html).toContain('} @else {');
        });
    });

    describe('Indentation Options', () => {
        it('should handle tab indentation', () => {
            const json = { tag: 'div', body: { tag: 'span', body: 'Hi' } };
            const html = new Json2html(json, { spaceType: 'tab', spaceLength: 1 }).toString();

            expect(html).toContain('\t<span>');
        });

        it('should disable indentation completely', () => {
            const json = { tag: 'div', body: { tag: 'span', body: 'Hi' } };
            const html = new Json2html(json, { indent: false }).toString();

            expect(html).toBe(`<div>\n<span>\nHi\n</span>\n</div>`);
        });
    });
});
