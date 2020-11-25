import React, {useEffect, useState} from "react";
import {Tabs, Tab, Button, Modal} from "react-bootstrap";
import {Maintainers, Identities, Assets, Orders, Marketplace} from "../actions/views"
import {Reveal, SendCoin} from "../actions/forms"
import axios from "axios";
import {getFaucet} from "../constants/url";

const ActionsSwitcher = () => {
    const userAddress = localStorage.getItem('address');
    const [externalComponent, setExternalComponent] = useState("");
    const [accountResponse, setAccountResponse] = useState("");
    const [key, setKey] = useState("home");
    const [show, setShow] = useState(false)
    const handleRoute = (route) => {
        setShow(true);
        setExternalComponent(route)
    }

    const handleFaucet = () => {
        const userAddress = localStorage.getItem('address');
        axios.post(process.env.REACT_APP_FAUCET_SERVER + "/faucetRequest", {address: userAddress})
            .then(response => console.log(response)).catch(err => console.log(err))
    };

    const url = getFaucet(userAddress);
    useEffect(() => {
        axios.get(url)
            .then((response) => {
                setAccountResponse(response.data.result.value)
            }).catch((error) => {
            console.log(error, "error section")
        });
    }, [])
    const handleClose = () => {
        setShow(false);
    };
    return (
        <div className="container">
            <div className="tabs-top-bar">
                <div className="buttons">
                    <Button onClick={() => handleRoute("Reveal")}>Reveal Meta</Button>
                    <Button onClick={() => handleRoute("SendCoin")}>Send Coin</Button>
                    {accountResponse.address == "" ?
                        <Button onClick={handleFaucet}>Faucet</Button>
                        : ""
                    }
                </div>
                {accountResponse.coins ? <p>
                        Amount: {accountResponse.coins[0].amount}
                    </p>
                    : "0"
                }
            </div>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="assetTabs Tabs"
            >
                <Tab eventKey="home" title="Assets">
                    <Assets/>
                </Tab>
                <Tab eventKey="Identities" title="Identities">
                    <Identities/>
                </Tab>
                <Tab eventKey="profile" title="Orders">
                    <Orders/>
                </Tab>
                <Tab eventKey="contact" title="Maintainer">
                    <Maintainers/>
                </Tab>
                <Tab eventKey="marketPlace" title="Marketplace">
                    <Marketplace/>
                </Tab>
            </Tabs>
            <Modal
                show={show}
                onHide={handleClose}
                centered
            >
                {externalComponent === 'Reveal' ?
                    <Reveal/> :
                    null
                }
                {externalComponent === 'Faucet' ?
                    <Faucet/> :
                    null
                }
                {externalComponent === 'SendCoin' ?
                    <SendCoin/> :
                    null
                }
            </Modal>
        </div>
    );
};

export default ActionsSwitcher;