export const examples = [
    ,
    {
        tag: 'div',
        attrs: { id: 'test1', class: 'testclasse' },
        body: [
            'test',
            {
                tag: 'div',
                attrs: { id: 'test2', class: 'foobar' },
                body: 'test'
            }
        ]
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
                            attrs: { id: 'test-subdiv', class: 'foobar' },
                            body: 'test3'
                        }
                    ]
                },
                {
                    tag: 'hr'
                },
                {
                    tag: 'span',
                    attrs: { id: 'test-span', class: 'bar' },
                    body: [
                        'test2'
                    ]
                }
            ]
        },
        {
            tag: 'span',
            attrs: { id: 'attr-2', class: 'bar' },
            body: [
                'test2'
            ]
        }
    ]
];
