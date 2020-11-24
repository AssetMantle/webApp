import React, {useEffect, useState} from "react";
import {Tabs, Tab, Button, Modal} from "react-bootstrap";
import {Maintainers, Identities, Assets, Orders, Marketplace} from "../actions/views"
import {Faucet, Reveal} from "../actions/forms"
import axios from "axios";
import { getFaucet } from "../constants/url";

const ActionsSwitcher = () => {
    const userAddress = localStorage.getItem('address');
    const [externalComponent, setExternalComponent] = useState("");
    const [accountResponse, setAccountResponse] = useState("");
    const [key, setKey] = useState("home");
    const [show, setShow] = useState(false)
    const handleRoute = (route) =>{
        setShow(true);
        setExternalComponent(route)
    }
    const url = getFaucet(userAddress);
    useEffect(()=>{
        axios.get(url)
            .then((response) => {
                setAccountResponse(response.data.result.value.address)
            }).catch((error) =>{
            console.log(error, " error section")
        });
    })
    const handleClose = () => {
        setShow(false);

    };
    return (
        <div className="container">
            <Button onClick={()=>handleRoute("Reveal")}>Reveal Meta</Button>
            {   accountResponse!== "" ?
                <Button onClick={() => handleRoute("Faucet")}>Faucet</Button>
                : ""
            }
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="assetTabs Tabs"
            >
                <Tab eventKey="home" title="Assets" >
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
                    <Reveal /> :
                    null
                }
                {externalComponent === 'Faucet' ?
                    <Faucet /> :
                    null
                }
            </Modal>
        </div>
    );
};

export default ActionsSwitcher;