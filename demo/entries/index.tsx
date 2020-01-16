/* eslint-disable react/jsx-no-bind */
import {useState, FC} from 'react';
import {render} from 'react-dom';
import {Input} from 'antd';
import {SourceView} from '../../src';
import '../../src/index.css';

const App: FC = () => {
    const [source, setSource] = useState('');

    return (
        <div>
            <div style={{marginBottom: 20}}>
                <Input.TextArea rows={20} value={source} onChange={e => setSource(e.target.value)} />
            </div>
            <SourceView source={source} />
        </div>
    );
};

render(
    <App />,
    document.body.appendChild(document.createElement('div'))
);
