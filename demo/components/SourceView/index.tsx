import {useMemo, FC, CSSProperties, MouseEvent} from 'react';
import {flatMap} from 'lodash';
import {highlight} from 'refractor';
import {tokenize, pickRanges, SourceRange} from 'source-tokenizer';
import 'prism-color-variables/variables.css';
import 'prism-color-variables/themes/visual-studio.css';
import {Source, RenderSyntaxTree, EventAttributes} from '../../../src';
import '../../../src/index.css';
import useSelection from './selection';
// @ts-ignore
import c from './index.less';

const renderTree: RenderSyntaxTree = (root, defaultRender, i) => {
    if (root.type === 'keyword') {
        return <mark key={i} className={c.mark}>{root.children.map(defaultRender)}</mark>;
    }

    return defaultRender(root, i);
};

const findKeywordRangesInLine = (line: number, source: string, keyword: string, start: number = 0): SourceRange[] => {
    const column = source.indexOf(keyword, start);

    if (column < 0) {
        return [];
    }

    const current: SourceRange = {
        line,
        column,
        type: 'keyword',
        length: keyword.length,
    };
    const next = findKeywordRangesInLine(line, source, keyword, column + keyword.length);
    return [current, ...next];
};

interface Props {
    style: CSSProperties;
    source: string;
    keyword: string;
    language?: string;
}

const SourceView: FC<Props> = ({style, source, keyword, language}) => {
    const syntax = useMemo(
        () => {
            const lines = source.split('\n');
            const keywordRanges = (source && keyword)
                ? flatMap(lines, (line, i) => findKeywordRangesInLine(i + 1, line, keyword))
                : [];
            const tokenizeOptions = {
                highlight: language ? (source: string) => highlight(source, language) : undefined,
                enhancers: [pickRanges(keywordRanges)],
            };
            return tokenize(source, tokenizeOptions);
        },
        [language, source, keyword]
    );
    const [selection, {selectIndex}] = useSelection();
    const selectedLines = useMemo(() => selection.map(i => i + 1), [selection]);
    const events: EventAttributes = useMemo(
        () => {
            return {
                onClick(line, e) {
                    selectIndex(line - 1, e as MouseEvent);
                },
            };
        },
        [selectIndex]
    );

    return (
        <Source
            key={source}
            style={style}
            source={source}
            syntax={syntax}
            renderSyntaxTree={renderTree}
            selectedLines={selectedLines}
            gutterEvents={events}
        />
    );
};

export default SourceView;
