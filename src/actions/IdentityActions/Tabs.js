import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import Orders from "./Orders";
import MutateAsset from "./Maintainer";
import Assets from "./Assets";
const Assetactions = () => {
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
          <Assets />
        </Tab>
        <Tab eventKey="profile" title="Orders">
          <MutateAsset />
        </Tab>
        <Tab eventKey="contact" title="Maintainer">
          <Orders />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Assetactions;
