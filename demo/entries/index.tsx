/* eslint-disable react/jsx-no-bind */
import {useState, FC, useMemo} from 'react';
import {render} from 'react-dom';
import {flatMap} from 'lodash';
import {Input} from 'antd';
import {highlight} from 'refractor';
import {tokenize, pickRanges, SourceRange} from 'source-tokenizer';
import 'prism-color-variables/variables.css';
import 'prism-color-variables/themes/visual-studio.css';
import {Source, RenderSyntaxTree} from '../../src';
import '../../src/index.css';
import './index.less';

const renderTree: RenderSyntaxTree = (root, defaultRender, i) => {
    if (root.type === 'keyword') {
        return <mark key={i}>{root.children.map(defaultRender)}</mark>;
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

const App: FC = () => {
    const [source, setSource] = useState('');
    const [keyword, setKeyword] = useState('');
    const syntax = useMemo(
        () => {
            const lines = source.split('\n');
            const keywordRanges = (source && keyword)
                ? flatMap(lines, (line, i) => findKeywordRangesInLine(i + 1, line, keyword))
                : [];
            const tokenizeOptions = {
                highlight(source: string) {
                    return highlight(source, 'typescript');
                },
                enhancers: [pickRanges(keywordRanges)],
            };
            return tokenize(source, tokenizeOptions);
        },
        [source, keyword]
    );

    return (
        <div>
            <div style={{marginBottom: 20}}>
                <Input.TextArea rows={20} value={source} onChange={e => setSource(e.target.value)} />
            </div>
            <div style={{marginBottom: 20}}>
                <Input value={keyword} onChange={e => setKeyword(e.target.value)} />
            </div>
            {source && <Source source={source} syntax={syntax} renderSyntaxTree={renderTree} />}
        </div>
    );
};

render(
    <App />,
    document.body.appendChild(document.createElement('div'))
);
