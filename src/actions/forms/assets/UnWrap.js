import React, {useState, useEffect} from "react";
import UnWrapJS from "persistencejs/transaction/splits/unwrap";
import {Form, Button, Modal} from "react-bootstrap";
import { useHistory } from "react-router-dom";
const UnWrapQuery = new UnWrapJS(process.env.REACT_APP_ASSET_MANTLE_API)

const UnWrap = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const FromId = event.target.FromId.value;
        const OwnableId = event.target.OwnableId.value;
        const Split = event.target.Split.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const UnWrapResponse = UnWrapQuery.unwrap(userAddress, "test", userTypeToken, FromId, OwnableId, Split, 25, "stake", 200000, "block");
        console.log(UnWrapResponse, "result UnWrapResponse")
    };

    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                {props.FormName}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>FromId </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Ownable Id </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="OwnableId"
                            required={true}
                            placeholder="Ownable Id"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Split </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="Split"
                            required={true}
                            placeholder="Split"
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

export default UnWrap;
