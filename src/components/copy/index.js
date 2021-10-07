import {CopyToClipboard} from 'react-copy-to-clipboard';
import React, {useState} from 'react';

const Copy = (props) => {
    const [copyValue, setCopyValue] = useState(false);
    const onCopy = () => {
        setCopyValue(true);
        setTimeout(() => {
            setCopyValue(false);
        }, 1000);
    };

    return (
        <div className="copy-section">
            <CopyToClipboard onCopy={onCopy} text={props.id}>
                <p>copy</p>
            </CopyToClipboard>
            <section className="copy-result">
                {copyValue ? <span>Copied</span> : null}
            </section>
        </div>
    );
};


export default Copy;
