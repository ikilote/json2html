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
});
