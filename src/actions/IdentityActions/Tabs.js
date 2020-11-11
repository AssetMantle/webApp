import React, {useState} from "react";
import {Tabs, Tab, Button, Modal} from "react-bootstrap";
import Orders from "./Orders";
import Maintainers from "./Maintainers";
import Assets from "./Assets";
import {Reveal} from "../forms"
import Idenities from "../IdentityList";

const ActionsSwitcher = () => {
    const [key, setKey] = useState("home");
    const [show, setShow] = useState(false)
    const handleRoute = () =>{
        setShow(true);
    }
   ;
    const handleClose = () => {
        setShow(false);
    };
    return (
        <div className="container">
            <Button onClick={handleRoute}>Reveal Meta</Button>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="assetTabs Tabs"
            >
                <Tab eventKey="home" title="Assets">
                    <Assets/>
                </Tab>
                <Tab eventKey="Idenities" title="Idenities">
                    <Idenities/>
                </Tab>
                <Tab eventKey="profile" title="Orders">
                    <Orders/>
                </Tab>
                <Tab eventKey="contact" title="Maintainer">
                    <Maintainers/>
                </Tab>
            </Tabs>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Reveal />
            </Modal>
        </div>
    );
};

export default ActionsSwitcher;
