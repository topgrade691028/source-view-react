/* eslint-disable react/jsx-no-bind */
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent} from '@testing-library/react';
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
            2: <p>This is a widget</p>,
        };
        const {getByText} = render(<Source source={source} widgets={widgets} />);
        expect(getByText('This is a widget')).toBeTruthy();
    });

    test('custom class name and style', () => {
        const {asFragment} = render(<Source source="" className="custom" style={{width: 400}} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('custom start line number', () => {
        const {container} = render(<Source source={source} lineStart={8} />);
        expect(container.querySelector('.source-gutter')).toHaveAttribute('data-line-number', '8');
    });

    test('custom gutter event', () => {
        const click = jest.fn();
        const {container} = render(<Source source={source} gutterEvents={{onClick: click}} />);
        fireEvent.click(container.querySelector('.source-gutter'), {});
        expect(click).toHaveBeenCalledTimes(1);
        expect(click.mock.calls[0][0]).toBe(1);
        expect(click.mock.calls[0][1]).toBeTruthy();
    });

    test('custom code event', () => {
        const click = jest.fn();
        const {container} = render(<Source source={source} codeEvents={{onClick: click}} />);
        fireEvent.click(container.querySelector('.source-code'), {});
        expect(click).toHaveBeenCalledTimes(1);
        expect(click.mock.calls[0][0]).toBe(1);
        expect(click.mock.calls[0][1]).toBeTruthy();
    });

    test('custom gutter renderer', () => {
        const renderGutter = line => <span>Custom line {line}</span>;
        const {getByText} = render(<Source source={source} renderGutter={renderGutter} />);
        expect(getByText('Custom line 1')).toBeTruthy();
    });
});
