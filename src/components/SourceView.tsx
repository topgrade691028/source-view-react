import {useMemo, FC, ReactNode} from 'react';
import {LineOfSyntax, SyntaxElement} from 'source-tokenizer';

export type RenderSyntaxElement = (node: SyntaxElement, defaultRender: RenderSyntaxElement, i: number) => ReactNode;

export interface SourceViewProps {
    source?: string;
    syntax?: LineOfSyntax[];
    renderSyntaxTree?: RenderSyntaxElement;
}

const renderSyntaxElement = (element: SyntaxElement, i: number): ReactNode => {
    if (typeof element === 'string') {
        return element;
    }

    return (
        <span key={i} className={element.properties?.className?.join(' ')}>
            {element.children.map(renderSyntaxElement)}
        </span>
    );
};

const renderGutter = (line: number): ReactNode => <td className="source-gutter" data-line-number={line} />;

const renderSourceContent = (source: string): ReactNode => <td className="source-code">{source}</td>;

const renderSyntaxContent = (syntax: LineOfSyntax): ReactNode => syntax.map(renderSyntaxElement);

const renderLine = (content: string | LineOfSyntax, i: number): ReactNode => (
    <tr key={i} className="source-line">
        {renderGutter(i + 1)}
        {typeof content === 'string' ? renderSourceContent(content) : renderSyntaxContent(content)}
    </tr>
);

export const SourceView: FC<SourceViewProps> = ({syntax, source}) => {
    const lines = useMemo(() => source?.split('\n') ?? [], [source]);

    if (syntax) {
        return null;
    }

    if (typeof source !== 'string') {
        throw new Error('react-source-view requires either source or syntax prop');
    }

    return (
        <table className="source">
            <tbody>
                {lines.map(renderLine)}
            </tbody>
        </table>
    );
};
