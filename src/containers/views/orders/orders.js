import React, {useState} from "react";
import OrderList from "./orderList";
import DefineOrder from "../../forms/orders/DefineOrder";
import {defineOrder as ordersDefineJS} from "persistencejs/build/transaction/orders/define";
const ordersDefine = new ordersDefineJS(process.env.REACT_APP_ASSET_MANTLE_API);
const Orders = () => {
    const [externalComponent, setExternalComponent] = useState("DefineOrder");
    return (
        <div className="accountInfo">
            <OrderList/>
            {externalComponent === 'DefineOrder' ?
                <DefineOrder setExternalComponent={setExternalComponent} ActionName={ordersDefine}
                    FormName={'Define Order'}/> :
                null
            }
        </div>
        
    );
};

export default Orders;
