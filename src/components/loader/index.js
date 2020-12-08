import React from 'react';
import {Modal} from "react-bootstrap";
import loader from "../../assets/images/loader.svg";

const Loader = () => {
    return (
        <Modal
            show={true}
            backdrop="static"
            keyboard={false}
            centered
            className="loader"
        >
            <img src={loader} alt="loader"/>
        </Modal>

    );
};


export default Loader;
