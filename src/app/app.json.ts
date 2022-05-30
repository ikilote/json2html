export const examples = [
    {
        tag: 'div',
        attrs: { id: 'test1', class: 'testclasse' },
        body: [
            'test',
            {
                tag: 'div',
                attrs: { id: 'test2', class: 'foobar' },
                body: 'test',
            },
        ],
    },
    [
        {
            tag: 'div',
            attrs: { id: 'test', class: 'testclasse', test: null },
            body: [
                'test',
                {
                    tag: 'div',
                    attrs: { id: 'test-div', class: 'foo' },
                    body: [
                        'test2',
                        {
                            tag: 'div',
                            attrs: {
                                id: 'test-subdiv',
                                class: 'foobar',
                                style: 'all: initial;',
                                lang: 'ja',
                                'data-test1': 'value1',
                                'data-test2': 'value2',
                                'data-test3': 'value3',
                            },
                            body:
                                `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ` +
                                `Ipsum has been the industry's standard dummy text ever since the 1500s, ` +
                                `when an unknown printer took a galley of type and scrambled it to make a type ` +
                                `specimen book. It has survived not only five centuries, but also the leap into ` +
                                `electronic typesetting, remaining essentially unchanged. It was popularised in the ` +
                                `1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more ` +
                                `recently with desktop publishing software like Aldus PageMaker including versions ` +
                                `of Lorem Ipsum.`,
                        },
                    ],
                },
                {
                    tag: 'hr',
                },
                {
                    tag: 'span',
                    attrs: { id: 'test-span', class: 'bar' },
                    body: ['test2'],
                },
            ],
            inline: false,
        },
        {
            tag: 'span',
            attrs: { id: 'attr-2', class: 'bar' },
            body: ['test2'],
        },
        {
            tag: 'test-autoclose',
            attrs: { id: 'attr-2', class: 'bar' },
            body: ['test2'],
            autoclose: true,
        },
        {
            tag: 'datalist',
            attrs: { id: 'id-datalist' },
            body: [
                { tag: 'option', attrs: { value: 'ABCD' } },
                { tag: 'option', attrs: { value: 'EFGH' } },
                { tag: 'option', attrs: { value: 'IJKL' } },
                { tag: 'option', attrs: { value: 'MNOP' } },
                { tag: 'option', attrs: { value: 'QRST' } },
                { tag: 'option', attrs: { value: 'UVW' } },
                { tag: 'option', attrs: { value: 'XYZ' } },
            ],
            inline: true,
        },
    ],
];
