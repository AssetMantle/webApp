import React, {useState, useEffect} from "react";
import Identities from "persistenceJS/transaction/identity/query";
import OrdersQuery from "persistenceJS/transaction/orders/query";
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
                        const filterOrdersByIdentities = Helper.FilterOrdersByIdentity(filterIdentities, ordersDataList)
                        setOrderList(filterOrdersByIdentities);
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
        <div className="row row-cols-1 row-cols-md-2 card-deck ">
        {orderList.map((order, index) => {
              var immutableProperties="";
              var mutableProperties="";
            if(order.value.immutables.value.properties.value.propertyList !== null){
            immutableProperties = Helper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
            }
            if(order.value.mutables.value.properties.value.propertyList !== null){
            mutableProperties = Helper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
            }
            var immutableKeys = Object.keys(immutableProperties);
            var mutableKeys = Object.keys(mutableProperties);
            return( <div className="col-md-6">
              <div className="card">
              
              <a href="#" key={index}>{order.value.id.value.hashID.value.idString}</a>
              <p>Immutables</p>
              {
                immutableKeys.map((keyName) => {
                return (<a key={index + keyName}>{keyName} {immutableProperties[keyName]}</a>)
                })
              }
                <p>Mutables</p>
              {
                mutableKeys.map((keyName) => {
                return (<a key={index + keyName}>{keyName} {mutableProperties[keyName]}</a>)
                })
              }
              </div>
              </div>
            )

          })}
          </div>
         </div>
        </div>
    );
};

export default Orders;
