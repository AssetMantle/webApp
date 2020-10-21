import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import BurnAsset from "./BurnAsset";
import MutateAsset from "./MutateAsset";
import AssetMint from "./AssetMint";
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
        <Tab eventKey="home" title="Asset Mint">
          <AssetMint />
        </Tab>
        <Tab eventKey="profile" title="Mutate Asset">
          <MutateAsset />
        </Tab>
        <Tab eventKey="contact" title="Burn Asset">
          <BurnAsset />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Assetactions;
