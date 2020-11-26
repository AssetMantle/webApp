import React, {useState, useEffect} from "react";
import RevealMetaJS from "persistencejs/transaction/meta/reveal";
import {Form, Button, Modal} from "react-bootstrap";
import InputField from "../../components/inputField";
const RevealMeta = new RevealMetaJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Reveal = () => {
    const [dataTypeOption, setDataTypeOption] = useState("S|");
    const handleSelectChange = evt => {
        setDataTypeOption(evt.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const MutableDataName = event.target.MutableDataName.value;
        const metaFact = dataTypeOption + MutableDataName
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
                    <InputField
                        type="text"
                        className=""
                        name="MutableDataName"
                        required={true}
                        placeholder="Data Name"
                        label="Data Name "
                        disabled={false}
                    />
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
