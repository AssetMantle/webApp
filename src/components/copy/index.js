import {CopyToClipboard} from 'react-copy-to-clipboard';
import React, {useState} from 'react';
import copy from "../../assets/images/copy.svg"

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
                <img src={copy} alt="copy" className="copy-icon"/>
            </CopyToClipboard>
            <section className="copy-result">
                {copyValue ? <span>Copied.</span> : null}
            </section>
        </div>
    );
};


export default Copy;
