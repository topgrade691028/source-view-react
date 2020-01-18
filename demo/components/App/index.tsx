import {useState, FC} from 'react';
import DebouncedInput from '../DebouncedInput';
import SourceView from '../SourceView';
import Settings, {SourceSettings} from '../Settings';
// @ts-ignore
import c from './index.less';

const App: FC = () => {
    const [source, setSource] = useState('');
    const [settings, setSettings] = useState<SourceSettings>({keyword: '', markTab: false, markCarriageReturn: false});

    return (
        <div className={c.root}>
            <div style={{marginBottom: 20}}>
                <DebouncedInput is="textarea" rows={12} placeholder="Source code" onChange={setSource} />
            </div>
            <Settings value={settings} onChange={setSettings} />
            {source && <SourceView source={source} {...settings} />}
        </div>
    );
};

export default App;
