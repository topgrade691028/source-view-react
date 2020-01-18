import {useMemo, FC, ReactNode} from 'react';
import {LineOfSyntax, SyntaxElement, TreeNode} from 'source-tokenizer';

export type RenderSyntaxTree = (root: TreeNode, defaultRender: RenderSyntaxElement, i: number) => ReactNode;

export type RenderSyntaxElement = (element: SyntaxElement, i: number) => ReactNode;

interface SourceProps {
    source?: string;
    syntax?: LineOfSyntax[];
    renderSyntaxTree?: RenderSyntaxTree;
    widgets?: {[key: number]: ReactNode};
}

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

const renderSyntaxContent = (syntax: LineOfSyntax, {renderSyntaxTree}: SourceProps): ReactNode => {
    const render = (element: SyntaxElement, i: number) => {
        if (typeof element === 'string') {
            return element;
        }

        if (renderSyntaxTree) {
            return renderSyntaxTree(element, renderGenericElement, i);
        }

        return renderGenericElement(element, i);
    };

    return syntax.map(render);
};

const reduceLineWith = (props: SourceProps) => {
    const {widgets = {}} = props;

    return (children: ReactNode[], current: string | LineOfSyntax, i: number): ReactNode[] => {
        const lineNumber = i + 1;

        const lineElement = (
            <tr key={`line-${lineNumber}`} className="source-line">
                <td className="source-gutter" data-line-number={lineNumber} />
                <td className="source-code">
                    {typeof current === 'string' ? current : renderSyntaxContent(current, props)}
                </td>
            </tr>
        );
        children.push(lineElement);

        const widget = widgets[lineNumber];
        if (widget) {
            const widgetContainerElement = (
                <tr key={`widget-${lineNumber}`} className="source-widget">
                    <td colSpan={2}>
                        {widget}
                    </td>
                </tr>
            );
            children.push(widgetContainerElement);
        }

        return children;
    };
};

export const Source: FC<SourceProps> = props => {
    const {source, syntax} = props;
    const lines = useMemo(() => source?.split('\n') ?? [], [source]);
    const reduceLine = reduceLineWith(props);

    return (
        <table className="source">
            <tbody>
                {syntax ? syntax.reduce(reduceLine, []) : lines.reduce(reduceLine, [])}
            </tbody>
        </table>
    );
};
