import React, {useState, useEffect} from "react";
import RevealMetaJS from "persistencejs/transaction/meta/reveal";
import {Form, Button, Modal} from "react-bootstrap";
import { useHistory } from "react-router-dom";
const RevealMeta = new RevealMetaJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Reveal = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [dataTypeOption, setDataTypeOption] = useState("S|");
    const handleClose = () => {
        setShow(false);
        // history.push('ActionsSwitcher')
    };

    const handleSelectChange = evt => {
        setDataTypeOption(evt.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const MutableDataName = event.target.MutableDataName.value;

        const metaFact = dataTypeOption + MutableDataName
        console.log(metaFact, "Dataoption")
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const RevealMetaResponse = RevealMeta.reveal(userAddress, "test", userTypeToken, metaFact, 25, "stake", 200000, "block");
        console.log(RevealMetaResponse, "result RevealMeta")
    };

    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Meta Reveal
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Data Type</Form.Label>
                        <Form.Control as="select" value={dataTypeOption} name="MutableDataType"
                                      onChange={handleSelectChange}
                                      required={true}>
                            <option value="S|">String</option>
                            <option value="D|">Decimal</option>
                            <option value="H|">Height</option>
                            <option value="I|">IDtype</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Data Name </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="MutableDataName"
                            required={true}
                            placeholder="Data Name"
                        />
                    </Form.Group>
                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </div>
    );
};

export default Reveal;
