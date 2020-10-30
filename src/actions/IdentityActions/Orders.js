import React, {useState, useEffect} from "react";
import Identities from "persistenceJS/transaction/identity/query";
import OrdersQuery from "persistenceJS/transaction/orders/query";
import Helper from "../../utilities/helper";


import { Modal, Form, Button } from "react-bootstrap";

const Orders = () => {
  const HelperF = new Helper();
  const [splitList, setSplitList] = useState([]);
  const userAddress = localStorage.getItem('address');
          useEffect(() => {
              const fetchOrder =() => {
                  const ordersData = OrdersQuery.queryOrderWithID("redfa")
                  ordersData.then(function(item) {
                      const data = JSON.parse(item);
                      console.log(data, "orders")
                      // const dataList = data.result.value.identities.value.list;
                      // const filterIdentities = HelperF.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                      // const splits = Splits.querySplitsWithID("all")
                      //     splits.then(function(splitsitem) {
                      //     const splitData = JSON.parse(splitsitem);
                      //     const splitList = splitData.result.value.splits.value.list;
                      //     const filterIdentitiesBySplits = HelperF.FilterIdentitiesBySplits(filterIdentities, splitList)
                      //     console.log(filterIdentitiesBySplits," splits list")
                      //     setSplitList(filterIdentitiesBySplits);
                      // })
                  })
              }
              fetchOrder();
            }, []);

  return (
    <div className="container">
 
      <div className="accountInfo">
        <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
          <div className="col-md-6 custom-pad signup-box">

          </div>
        </div>
        <Modal
          className="accountInfoModel"
          centered
        >
          <Modal.Header>
              <div className="icon failure-icon">
                <i class="mdi mdi-close"></i>
              </div>
          </Modal.Header>
          <Modal.Body>
         
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary">
              ok
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Orders;
