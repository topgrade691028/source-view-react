import {useState, FC, useCallback, useMemo, useRef, ChangeEvent} from 'react';
import {debounce} from 'lodash';
import {Input} from 'antd';

interface Props {
    is?: 'input' | 'textarea';
    wait?: number;
    rows?: number;
    placeholder?: string;
    onChange(value: string): void;
}

const DebouncedInput: FC<Props> = ({is = 'input', wait = 300, rows, placeholder, onChange}) => {
    const [value, setValue] = useState('');
    const valueCache = useRef('');
    const submitChange = useMemo(
        () => debounce(() => onChange(valueCache.current), wait),
        [onChange, wait]
    );
    const updateValue = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;
            setValue(value);
            valueCache.current = value;
            submitChange();
        },
        [submitChange]
    );

    if (is === 'input') {
        return <Input value={value} placeholder={placeholder} onChange={updateValue} />;
    }

    return <Input.TextArea value={value} rows={rows} placeholder={placeholder} onChange={updateValue} />;
};

export default DebouncedInput;
