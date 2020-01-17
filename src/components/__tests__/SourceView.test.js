/* eslint-disable react/jsx-no-bind */
import {render} from '@testing-library/react';
import {highlight} from 'refractor';
import {tokenize} from 'source-tokenizer';
import {SourceView} from '../SourceView';

const source = `const a = 3;
console.log(3);`;

describe('SourceView', () => {
    test('text source', () => {
        const {asFragment} = render(<SourceView source={source} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('syntax source', () => {
        const options = {
            highlight(source) {
                return highlight(source, 'javascript');
            },
        };
        const syntax = tokenize(source, options);
        const {asFragment} = render(<SourceView source={source} syntax={syntax} />);
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
        const {asFragment} = render(<SourceView syntax={syntax} renderSyntaxTree={stripSyntax} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
