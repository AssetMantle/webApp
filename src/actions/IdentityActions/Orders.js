import React, {useState, useEffect} from "react";
import Identities from "persistencejs/transaction/identity/query";
import OrdersQuery from "persistencejs/transaction/orders/query";
import Helpers from "../../utilities/helper";


import {Modal, Form, Button} from "react-bootstrap";

const Orders = () => {
  const Helper = new Helpers();
  const [orderList, setOrderList] = useState([]);
  const userAddress = localStorage.getItem('address');
          useEffect(() => {
              const fetchOrder =() => {

                const identities = Identities.queryIdentityWithID("all")
                identities.then(function (item) {
                    const data = JSON.parse(item);
                    const dataList = data.result.value.identities.value.list;
                    const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                    const ordersData = OrdersQuery.queryOrderWithID("all")
                    ordersData.then(function(item) {
                        const ordersData = JSON.parse(item);
                        const ordersDataList = ordersData.result.value.orders.value.list;
                        if(ordersDataList){
                        const filterSplitsByIdentities = Helper.FilterOrdersByIdentity(filterIdentities, ordersDataList)
                        setOrderList(filterSplitsByIdentities);
                        }
                        else{
                          console.log("no orders found")
                        }
                    })

                })
              }
              fetchOrder();
            }, []);

  return (
    <div className="container">
 
      <div className="accountInfo">
        <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
          <div className="col-md-6 custom-pad card">
          {orderList.map((order, index) => {
              return (
                  <a href="#" key={index}>{order.value.id.value.makerID.value.idString}</a>
              );
          })}
          </div>
         </div>
          </div>
        </div>
    );
};

export default Orders;
