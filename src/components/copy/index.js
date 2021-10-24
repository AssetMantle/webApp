import {CopyToClipboard} from 'react-copy-to-clipboard';
import React, {useState} from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

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
            <OverlayTrigger
                key="top"
                placement="top"
                overlay={
                    <Tooltip id={`tooltip-top}`}>
                        {copyValue ? <span>Copied</span> : <span>Copy</span>}
                    </Tooltip>
                }
            >
                <CopyToClipboard onCopy={onCopy} text={props.id}>
                    <p className="id-string"
                        title={props.id}> {props.id}</p>
                </CopyToClipboard>
            </OverlayTrigger>

            {/*<section className="copy-result">*/}

            {/*</section>*/}
        </div>
    );
};


export default Copy;
