import React, {useState} from "react";
import {Tabs, Tab} from "react-bootstrap";
import Orders from "./Orders";
import MutateAsset from "./Maintainer";
import Assets from "./Assets";
import Idenities from "../IdentityList";

const ActionsSwitcher = () => {
    const [key, setKey] = useState("home");
    return (
        <div className="container">
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
                    <MutateAsset/>
                </Tab>
            </Tabs>
        </div>
    );
};

export default ActionsSwitcher;
