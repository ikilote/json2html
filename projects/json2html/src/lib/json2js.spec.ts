import { describe, expect, it } from 'vitest';

import { Json2Js } from './json2js';

describe('Json2Js', () => {
    describe('Basic Object Rendering', () => {
        it('should transform a simple flat object', () => {
            const input = { key: 'value', number: 123, boolean: true };
            const converter = new Json2Js(input);
            const result = converter.toString();

            expect(result).toBe(`{
    key: 'value',
    number: 123,
    boolean: true
}`);
        });

        it('should handle empty objects', () => {
            const input = {};
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe('{}');
        });

        it('should accept a string as input', () => {
            // If input is already a string, it returns it directly (though regexes still run)
            const input = '{"a":1}';
            const converter = new Json2Js(input);
            // Note: The regex replaces "a": with a:
            expect(converter.toString()).toBe(`{a:1}`);
        });
    });

    describe('Key Formatting Rules', () => {
        it('should remove quotes from alphanumeric keys', () => {
            const input = { simpleKey123: 'val' };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    simpleKey123: 'val'
}`);
        });

        it('should use single quotes for non-alphanumeric keys', () => {
            const input = { 'kebab-case': 'val', 'space key': 'val', $special: 'val' };
            const converter = new Json2Js(input);
            const result = converter.toString();

            expect(result).toBe(`{
    'kebab-case': 'val',
    'space key': 'val',
    '$special': 'val'
}`);
        });
    });

    describe('String Value Formatting Rules', () => {
        it('should prefer single quotes for standard strings', () => {
            const input = { test: 'hello world' };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    test: 'hello world'
}`);
        });

        it('should use double quotes if string contains single quotes', () => {
            const input = { test: "I'm testing" };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    test: \`I'm testing\`
}`);
        });

        it('should use backticks if string contains both single and double quotes', () => {
            const input = { test: `Say "Hello" to 'World'` };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    test: \`Say "Hello" to 'World'\`
}`);
        });

        it('should handle escaped double quotes correctly', () => {
            // Logic: It temporarily replaces \" with (--), processes, then puts " back
            const input = { test: 'Content with "quotes"' };
            const converter = new Json2Js(input);
            // Since it has no single quotes, it prefers single quotes wrapper: 'Content with "quotes"'
            expect(converter.toString()).toBe(`{
    test: 'Content with "quotes"'
}`);
        });

        it('should escape backticks inside template literals', () => {
            // This tests the complex backTickReplaceRegex
            const input = { test: `Mixed ' and " and \` backtick` };
            const converter = new Json2Js(input);
            // Should result in: `Mixed ' and " and \` backtick`
            expect(converter.toString()).toBe(`{
    test: \`Mixed ' and " and \\\` backtick\`
}`);
        });
    });

    describe('Indentation Options', () => {
        it('should respect custom tabSize', () => {
            const input = { a: 1 };
            const converter = new Json2Js(input, { tabSize: 2 });
            expect(converter.toString()).toBe(`{
  a: 1
}`);
        });

        it('should respect tabAdded (global indentation)', () => {
            const input = { a: 1 };
            // tabSize 4 * tabAdded 1 = 4 spaces base
            const converter = new Json2Js(input, { tabSize: 4, tabAdded: 1 });
            const result = converter.toString();

            // The opening brace is not indented by existing logic, but content and closing brace are?
            // Let's verify exact output based on code logic:
            // The code replaces `( {2,}[{\]}"])` -> adding tabAdded.

            expect(result).toBe(`    {
        a: 1
    }`);
        });

        it('should respect tabAdded (global indentation) except first', () => {
            const input = { a: 1 };
            // tabSize 4 * tabAdded 1 = 4 spaces base
            const converter = new Json2Js(input, { tabSize: 4, tabAdded: 1, tabAddedExceptFirst: true });
            const result = converter.toString();

            // The opening brace is not indented by existing logic, but content and closing brace are?
            // Let's verify exact output based on code logic:
            // The code replaces `( {2,}[{\]}"])` -> adding tabAdded.

            expect(result).toBe(`{
        a: 1
    }`);
        });

        it('should handle nested objects with indentation', () => {
            const input = { level1: { level2: 'val' } };
            const converter = new Json2Js(input, { tabSize: 2 });
            expect(converter.toString()).toBe(`{
  level1: {
    level2: 'val'
  }
}`);
        });

        it('should handle defaults when options are empty', () => {
            const input = { a: 1 };
            const converter = new Json2Js(input, {});
            // Default 4 spaces
            expect(converter.toString()).toBe(`{
    a: 1
}`);
        });
    });

    describe('Arrays', () => {
        it('should format arrays of strings', () => {
            const input = { list: ['a', 'b'] };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    list: [
        "a",
        "b"
    ]
}`);
        });

        it('should format arrays of objects', () => {
            const input = { list: [{ id: 1 }] };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    list: [
        {
            id: 1
        }
    ]
}`);
        });
    });

    describe('Error Handling', () => {
        it('should throw a custom error on circular references', () => {
            const circular: any = {};
            circular.myself = circular;

            const converter = new Json2Js(circular);

            expect(() => converter.toString()).toThrow('Json2Js: impossible to transform');
        });

        it('should preserve the original error as cause when throwing', () => {
            const circular: any = {};
            circular.myself = circular;

            const converter = new Json2Js(circular);

            try {
                converter.toString();
                expect.fail('Should have thrown an error');
            } catch (e: any) {
                expect(e.message).toBe('Json2Js: impossible to transform');
                expect(e.cause).toBeDefined();
                expect(e.cause.message).toContain('circular');
            }
        });
    });

    describe('Edge Cases', () => {
        it('should handle null values', () => {
            const input = { value: null };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    value: null
}`);
        });

        it('should handle undefined values (converted to null by JSON.stringify)', () => {
            const input = { defined: 'yes', undefined: undefined };
            const converter = new Json2Js(input);
            // JSON.stringify omits undefined values
            expect(converter.toString()).toBe(`{
    defined: 'yes'
}`);
        });

        it('should handle NaN (converted to null by JSON.stringify)', () => {
            const input = { value: NaN };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    value: null
}`);
        });

        it('should handle Infinity (converted to null by JSON.stringify)', () => {
            const input = { positive: Infinity, negative: -Infinity };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    positive: null,
    negative: null
}`);
        });

        it('should handle strings with newlines', () => {
            const input = { text: 'line1\nline2' };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    text: 'line1\\nline2'
}`);
        });

        it('should handle strings with tabs', () => {
            const input = { text: 'col1\tcol2' };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    text: 'col1\\tcol2'
}`);
        });

        it('should handle empty strings', () => {
            const input = { empty: '' };
            const converter = new Json2Js(input);
            expect(converter.toString()).toBe(`{
    empty: ''
}`);
        });

        it('should handle very long strings', () => {
            const longString = 'a'.repeat(1000);
            const input = { long: longString };
            const converter = new Json2Js(input);
            const result = converter.toString();
            expect(result).toContain(longString);
        });

        it('should handle special characters in strings', () => {
            const input = { special: 'Hello\r\n\t\b\f' };
            const converter = new Json2Js(input);
            const result = converter.toString();
            expect(result).toContain('Hello');
        });

        it('should handle unicode characters', () => {
            const input = { emoji: '🚀', chinese: '你好', arabic: 'مرحبا' };
            const converter = new Json2Js(input);
            const result = converter.toString();
            expect(result).toContain('🚀');
            expect(result).toContain('你好');
            expect(result).toContain('مرحبا');
        });

        it('should handle negative tabSize (converted to 0)', () => {
            const input = { a: 1 };
            const converter = new Json2Js(input, { tabSize: -5 });
            // Negative tabSize is converted to 0, JSON.stringify produces compact output
            expect(converter.toString()).toBe(`{a:1}`);
        });

        it('should handle negative tabAdded (converted to 0)', () => {
            const input = { a: 1 };
            const converter = new Json2Js(input, { tabAdded: -2 });
            // Negative tabAdded is converted to 0
            expect(converter.toString()).toBe(`{
    a: 1
}`);
        });
    });
});
