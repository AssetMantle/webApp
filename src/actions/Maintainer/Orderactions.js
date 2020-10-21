import React, {useState} from "react";
import {Tabs, Tab} from "react-bootstrap";
import OrderCancel from './Ordercancel'
import OrderMake from './OrderMake'
const Orderactions = () => {
    const [key, setKey] = useState('home');
  return (
    <div className="container">
    <Tabs
    id="controlled-tab-example"
    activeKey={key}
    onSelect={(k) => setKey(k)}
    className="assetTabs Tabs"
  >
    <Tab eventKey="home" title="Order Make">
    <OrderMake />
    </Tab>
    <Tab eventKey="profile" title="Order Cancel">
    <OrderCancel />
    </Tab>
  </Tabs>
  </div>
  );
}

export default Orderactions;
