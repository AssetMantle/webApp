import {CopyToClipboard} from 'react-copy-to-clipboard';
import React, {useState} from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Icon from "../../icons";

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
                        {copyValue ? <span>Copied to clipboard</span> : <span>Copy to clipboard</span>}
                    </Tooltip>
                }
            >
                <CopyToClipboard onCopy={onCopy} text={props.id}>
                    {props.name ?
                        <button className="share-button" title="Delete NFT">
                            <Icon
                                viewClass="info"
                                icon="share"/>
                        </button>
                        :
                        <p className="id-string"
                            title={props.id}> {props.id}</p>
                    }
                </CopyToClipboard>

            </OverlayTrigger>

            {/*<section className="copy-result">*/}

            {/*</section>*/}
        </div>
    );
};


export default Copy;
