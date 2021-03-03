import {CopyToClipboard} from 'react-copy-to-clipboard';
import React, {useState} from 'react';

const Copy = (props) => {
    return (
        <div className="copy-section">
            <CopyToClipboard  text={props.id}>
                <p>copy</p>
            </CopyToClipboard>
        </div>
    );
};


export default Copy;
