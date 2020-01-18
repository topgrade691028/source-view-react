/* eslint-disable react/jsx-no-bind */
import {render} from '@testing-library/react';
import {highlight} from 'refractor';
import {tokenize} from 'source-tokenizer';
import {Source} from '../Source';

const source = `const a = 3;
console.log(3);`;

describe('Source', () => {
    test('text source', () => {
        const {asFragment} = render(<Source source={source} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('syntax source', () => {
        const options = {
            highlight(source) {
                return highlight(source, 'javascript');
            },
        };
        const syntax = tokenize(source, options);
        const {asFragment} = render(<Source source={source} syntax={syntax} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('custom syntax renderer', () => {
        const options = {
            highlight(source) {
                return highlight(source, 'javascript');
            },
        };
        const syntax = tokenize(source, options);
        const stripSyntax = node => {
            if (typeof node === 'string') {
                return node;
            }

            return node.children.map(stripSyntax);
        };
        const {asFragment} = render(<Source syntax={syntax} renderSyntaxTree={stripSyntax} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('with widgets', () => {
        const widgets = {
            2: <p>Hello World</p>,
        };
        const {asFragment} = render(<Source source={source} widgets={widgets} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
