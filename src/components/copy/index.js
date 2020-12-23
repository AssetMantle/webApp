import {CopyToClipboard} from 'react-copy-to-clipboard';
import React, {useState} from 'react';
import Icon from "../../icons";

const Copy = (props) => {
    const [copyValue, setCopyValue] = useState(false)
    const [copied, setCopied] = useState(false)
    const onCopy = () => {
        setCopyValue(true)
        setCopied(true)
        setTimeout(() => {
            setCopyValue(false)
        }, 1000);
    };
    return (
        <div className="copy-section">
            <CopyToClipboard onCopy={onCopy} text={props.id}>
                <p><Icon viewClass="copy-icon" icon="copy" /></p>
            </CopyToClipboard>
            <section className="copy-result">
                {copyValue ? <span>Copied</span> : null}
            </section>
        </div>
    );
};


export default Copy;
