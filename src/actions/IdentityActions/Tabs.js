import React, {useState} from "react";
import {Tabs, Tab, Button, Modal} from "react-bootstrap";
import Orders from "./Orders";
import Maintainers from "./Maintainers";
import Assets from "./Assets";
import Idenities from "../IdentityList";
import {Faucet} from "../forms";

const ActionsSwitcher = () => {
    const [key, setKey] = useState("home");

    const [showModal, setShowModal] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");

    const handleClose = () => {
        setShowModal(false);
    };
    const handleModalData = (formName) => {
        setShowModal(true)
        setExternalComponent(formName)
    }
    return (
        <div>
            <div className="container">
                <Button variant="secondary"
                        onClick={() => handleModalData("Faucet")}>Faucet</Button>
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
            </div>
            <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                {externalComponent === 'Faucet' ?
                    <Faucet/> :
                    null
                }
            </Modal>
        </div>
    );
};

export default ActionsSwitcher;
