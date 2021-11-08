import React from "react";
import OrderList from "./orderList";

const Orders = () => {
    // const {t} = useTranslation();
    // const [externalComponent, setExternalComponent] = useState("");
    //
    // const handleModalData = (formName) => {
    //     setExternalComponent(formName);
    // };

    return (
        <div className="accountInfo">
            <OrderList/>
        </div>
        // <div className="accountInfo">
        //     <div className="row">
        //         <div className="col-md-9 card-deck">
        //             <div className="dropdown-section">
        //                 <h4>Orders</h4>
        //                 <Dropdown>
        //                     <Dropdown.Toggle  id="dropdown-basic">
        //                         {t("ACTIONS")}
        //                     </Dropdown.Toggle>
        //                     <Dropdown.Menu>
        //                         <Dropdown.Item
        //                             onClick={() => handleModalData("DefineOrder")}>{t("DEFINE_ORDER")}</Dropdown.Item>
        //                         <Dropdown.Item
        //                             onClick={() => handleModalData("DefineOrder1")}>{t("DEFINE_ORDER1")}</Dropdown.Item>
        //                     </Dropdown.Menu>
        //                 </Dropdown>
        //             </div>
        //
        //         </div>
        //         <div className="col-md-3 summary-section">
        //             <Summary/>
        //         </div>
        //     </div>
        //     {externalComponent === 'DefineOrder' ?
        //         <DefineOrder setExternalComponent={setExternalComponent} ActionName={ordersDefine}
        //             FormName={'Define Order'}/> :
        //         null
        //     }
        //     {externalComponent === 'DefineOrder1' ?
        //         <Define setExternalComponent={setExternalComponent} ActionName={ordersDefine}
        //             FormName={'Define Order'}/> :
        //         null
        //     }
        //
        // </div>
    );
};

export default Orders;
