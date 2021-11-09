import React, {useEffect, useState} from 'react';
import Icon from "../../../icons";
import {fetchAddress} from "../../../utilities/Helpers/ledger";
import {Button, Form, Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
// import Loader from "../../../components/loader";
const Ledger = (props) => {
    const history = useHistory();
    const [ledgerAddress, setLedgerAddress] = useState('');
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [advancedMode, setAdvancedMode] = useState(false);
    const [addressUpdate, setAddressUpdate] = useState(false);
    // const [loader, setLoader] = useState(false);
    const userName = props.userData.userName;
    const handleAdvanceMode = () => {
        setAdvancedMode(!advancedMode);
    };
    const backHandler = () => {
        setShow(false);
        props.setShow(true);
        props.setExternalComponent('');
    };
    useEffect(() => {
        let ledgerResponse = fetchAddress("mantle");
        ledgerResponse.then(function (result) {
            setLedgerAddress(result);
        }).catch(err => {
            console.log(err);
            setErrorMessage(err.response
                ? err.response.data.message
                : err.message);
        });

    }, []);
    const handleSubmit = (event) => {
        event.preventDefault();
        let accountNumber = 0;
        let addressIndex = 0;
        if (advancedMode) {
            accountNumber = document.getElementById('ledgerAccountNumber').value;
            addressIndex = document.getElementById('ledgerAccountIndex').value;
            if (accountNumber === "") {
                accountNumber = 0;
            }
            if (addressIndex === "") {
                addressIndex = 0;
            }
        }
        let ledgerResponse = fetchAddress("mantle", accountNumber, addressIndex);
        ledgerResponse.then(function (result) {
            setLedgerAddress(result);
            setAddressUpdate(true);
            localStorage.setItem('accountNumber', accountNumber.toString());
            localStorage.setItem('addressIndex', addressIndex.toString());

        }).catch(err => {
            setErrorMessage(err.response
                ? err.response.data.message
                : err.message);
        });
    };
    const handleLogin = () => {
        if (!addressUpdate) {
            let accountNumber = 0;
            let addressIndex = 0;
            localStorage.setItem('accountNumber', accountNumber.toString());
            localStorage.setItem('addressIndex', addressIndex.toString());
        }
        let list = [];
        let idList = [];
        const addressList = localStorage.getItem("addresses");
        const userList = localStorage.getItem("userList");
        const identityList = localStorage.getItem("identityList");
        if (identityList !== null) {
            idList = JSON.parse(identityList);
        }
        if (userList !== null) {
            list = JSON.parse(userList);
        }
        if (addressList.includes(ledgerAddress)) {
            idList.push({[userName]: props.userData.identityId});
            list.push(userName);
            localStorage.setItem("identityId", props.userData.identityId);
            localStorage.setItem("userList", JSON.stringify(list));
            localStorage.setItem("userName", userName);
            // setAddress(ledgerAddress);
            localStorage.setItem("userAddress", ledgerAddress);
            localStorage.setItem("loginMode", "ledger");

            localStorage.setItem("identityList", JSON.stringify(idList));
            history.push('/profile');
            window.location.reload();
            setErrorMessage("");
        } else {
            setErrorMessage('Address not found in identity list');
        }
    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        history.push('/');
    };
    const handleKeypress = e => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };
    return (
        <div className="custom-modal seed">
            <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section key-select"
                centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={backHandler}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    <p className="title">{props.network}</p>
                </Modal.Header>
                <Modal.Body>
                    {
                        errorMessage !== "" ?
                            <p className="error-response">{errorMessage}</p>
                            :
                            <>
                                {
                                    ledgerAddress !== ""
                                        ?
                                        <>
                                            <div className="buttons-list">
                                                <p>{ledgerAddress}</p>
                                                <div className="submitButtonSection">
                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        onClick={handleLogin}
                                                        className="button-double-border"
                                                    >
                                                        Proceed to Login
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="select-gas">
                                                <p onClick={handleAdvanceMode}
                                                    className="text-center">{!advancedMode ? "Advanced" : "Advanced"}
                                                    {!advancedMode ?
                                                        <Icon
                                                            viewClass="arrow-right"
                                                            icon="down-arrow"/>
                                                        :
                                                        <Icon
                                                            viewClass="arrow-right"
                                                            icon="up-arrow"/>}
                                                </p>
                                            </div>
                                            {advancedMode
                                                ?
                                                <Form onSubmit={handleSubmit}>
                                                    <Form.Group>
                                                        <Form.Label>Account Number</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            min={0}
                                                            max={4294967295}
                                                            name="accountNumber"
                                                            id="ledgerAccountNumber"
                                                            onKeyPress={handleKeypress}
                                                            placeholder="Account Number"
                                                            required={false}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label>Account Index</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            min={0}
                                                            max={4294967295}
                                                            name="accountIndex"
                                                            id="ledgerAccountIndex"
                                                            onKeyPress={handleKeypress}
                                                            placeholder="Account Index"
                                                            required={false}
                                                        />
                                                    </Form.Group>
                                                    <div className="buttons">
                                                        <button className="button-txn btn btn-primary btn-sm"
                                                            type="submit">Submit
                                                        </button>
                                                    </div>
                                                </Form>
                                                : ""
                                            }

                                        </>
                                        :
                                        <>
                                            <p className="fetching">Fetching Address</p>
                                        </>

                                }

                            </>
                    }
                </Modal.Body>
            </Modal>
        </div>

    );
};

export default Ledger;
