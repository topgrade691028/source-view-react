import {useMemo, FC, ReactNode} from 'react';
import {LineOfSyntax, SyntaxElement, TreeNode} from 'source-tokenizer';

export type RenderSyntaxTree = (root: TreeNode, defaultRender: RenderSyntaxElement, i: number) => ReactNode;

export type RenderSyntaxElement = (element: SyntaxElement, i: number) => ReactNode;

interface TextViewProps {
    source: string;
}

interface SyntaxViewProps {
    syntax: LineOfSyntax[];
    renderSyntaxTree?: RenderSyntaxTree;
}

export type SourceViewProps = TextViewProps & SyntaxViewProps;

const renderGenericElement = (element: SyntaxElement, i: number): ReactNode => {
    if (typeof element === 'string') {
        return element;
    }

    return (
        <span key={i} className={element.properties?.className?.join(' ')}>
            {element.children.map(renderGenericElement)}
        </span>
    );
};

const renderGutter = (line: number): ReactNode => <td className="source-gutter" data-line-number={line} />;

const renderSourceContent = (source: string): ReactNode => <td className="source-code">{source}</td>;

const renderSyntaxContent = (syntax: LineOfSyntax, {renderSyntaxTree}: SourceViewProps): ReactNode => {
    const render = (element: SyntaxElement, i: number) => {
        if (typeof element === 'string') {
            return element;
        }

        if (renderSyntaxTree) {
            return renderSyntaxTree(element, renderGenericElement, i);
        }

        return renderGenericElement(element, i);
    };

    return <td className="source-code">{syntax.map(render)}</td>;
};

const renderSourceLine = (content: string, i: number): ReactNode => (
    <tr key={i} className="source-line">
        {renderGutter(i + 1)}
        {renderSourceContent(content)}
    </tr>
);

const renderSyntaxLine = (content: LineOfSyntax, i: number, props: SourceViewProps): ReactNode => (
    <tr key={i} className="source-line">
        {renderGutter(i + 1)}
        {renderSyntaxContent(content, props)}
    </tr>
);

export const SourceView: FC<SourceViewProps> = props => {
    const {source, syntax} = props;
    const lines = useMemo(() => source?.split('\n') ?? [], [source]);

    return (
        <table className="source">
            <tbody>
                {
                    syntax
                        ? syntax.map((item, i) => renderSyntaxLine(item, i, props))
                        : lines.map(renderSourceLine)
                }
            </tbody>
        </table>
    );
};
