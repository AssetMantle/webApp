import React, {useState, useEffect} from 'react';
import Icon from "../../../icons";
import {Button, Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
// import Loader from "../../../components/loader";
const Keplr = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [address, setAddress] = useState(false);
    // const [loader, setLoader] = useState(false);
    const userName = localStorage.getItem("userName");
    const backHandler = () => {
        setShow(false);
        props.setShow(true);
        props.setExternalComponent('');
    };

    useEffect(() => {
        const kepler = KeplerWallet();
        kepler.then(function () {
            const keplrAddress = localStorage.getItem("keplerAddress");
            let list = [];
            let idList = [];
            const addressList = localStorage.getItem("addresses");
            const userList = localStorage.getItem("userList");
            const identityList = localStorage.getItem("identityList");
            if(identityList !== null){
                idList = JSON.parse(identityList);
            }
            if(userList !== null){
                list = JSON.parse(userList);
            }
            if (addressList.includes(keplrAddress)) {


                idList.push({[userName]:  localStorage.getItem("identityId")});
                list.push(userName);
                localStorage.setItem("userList", JSON.stringify(list));
                localStorage.setItem("userName", userName);
                setAddress(keplrAddress);
                localStorage.setItem("userAddress", keplrAddress);
                localStorage.setItem("identityList",  JSON.stringify(idList));
                setErrorMessage("");
            } else {
                console.log(addressList, "addressList");
                setErrorMessage('Keplr address not found in identity list');
            }
        }).catch(err => {
            setErrorMessage(err.message);
        });

    }, []);
    const handleSubmit = () => {
        history.push('/profile');
    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        history.push('/');
    };
    return (
        <div className="custom-modal seed">
            <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section key-select" centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={backHandler}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    <p className="title">{props.network}</p>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage !== ""?
                        <p className="error-response">{errorMessage}</p>
                        :
                        <>
                            <p><b>Address:</b> {address}</p>

                            <div className="submitButtonSection">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="button-double-border"
                                >
                                    Proceed to Login
                                </Button>
                            </div>
                        </>
                    }

                </Modal.Body>
            </Modal>
        </div>

    );
};

export default Keplr;
