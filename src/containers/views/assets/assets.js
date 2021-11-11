import React, {useState} from "react";
import {DefineAsset, UnWrap, Wrap} from "../../forms/assets";
import {defineAsset} from "persistencejs/build/transaction/assets/define";
import AssetList from "./assetList";
import OrderList from "../orders/orderList";
import {Tab, Tabs} from "react-bootstrap";
const assetDefine = new defineAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const Assets = () => {
    const [externalComponent, setExternalComponent] = useState("");

    return (
        <div className="accountInfo container">
            <Tabs defaultActiveKey="Collections"
                id="uncontrolled-tab-example"
                className="assets-tab">
                <Tab eventKey="Collections"
                    title="Collections">
                    <AssetList />
                </Tab>
                <Tab eventKey="Listings" title="Listings">
                    <OrderList/>
                </Tab>

            </Tabs>
            <div>
                {externalComponent === 'DefineAsset' ?
                    <DefineAsset setExternalComponent={setExternalComponent} ActionName={assetDefine}
                        FormName={'Define Asset'} type={'asset'}/> :
                    null
                }
                {
                    externalComponent === 'Wrap' ?
                        <Wrap setExternalComponent={setExternalComponent} FormName={'Wrap'}/> :
                        null
                }
                {
                    externalComponent === 'UnWrap' ?
                        <UnWrap setExternalComponent={setExternalComponent} FormName={'UnWrap'}/> :
                        null
                }
            </div>
        </div>
    );
};

export default Assets;
