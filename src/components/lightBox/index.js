import React, {Component, useState} from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Footer from "../Footer"; // This only needs to be imported once in your app

const LightboxEx = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    return(
        <Lightbox
            mainSrc={props.src}
            onCloseRequest={() => setIsOpen(false )}
        />
    );
};

export default LightboxEx;
