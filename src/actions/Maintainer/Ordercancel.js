import React, {useState} from "react";
import AssetsDropdown from '../../constants/AssetsDropdownList';
import axios from "axios";
import { assetOrderURL, buyAssetHashURL, assetsURL, buyAssetSplitsURL, OrderCancelURL} from "../../constants/url"
import {Modal, Form, Button} from "react-bootstrap";
import loader from '../../assets/images/loader.svg'

const OrderCancel = () => {
    const [loading ,setLoader] = useState(false);
    const [show, setShow] = useState(false);
    const [errorData , setErrorData] = useState("");
    const [responseData , setResponseData] = useState("");
    const handleClose = () =>
    {
      setShow(false);
      window.location.reload();
    } 
    const handleSubmit = event => {
        setLoader(true);
        event.preventDefault();
        const selectValue = event.target.selectChange.value;
        const fromIDurl = assetsURL();
        axios.get(fromIDurl).then(
          (responseidentities)=>{
            const assetItemList = responseidentities.data.result.value.assets.value.list;  
            assetItemList.forEach((asset) => {
              if(asset.value.immutables.value.properties.value.propertyList[0].value.id.value.idString === "Name"){
               const hash = asset.value.immutables.value.properties.value.propertyList[0].value.fact.value.hash;
               const hashurl = buyAssetHashURL(hash);
               axios.get(hashurl).then(
                (hashresponse)=>{
                  const listname2 = hashresponse.data.result.value.metas.value.list[0].value.data.value.value;
                  if(listname2 === selectValue){
                    const clasificationID = asset.value.id.value.classificationID.value.idString;                
                    const hashID = asset.value.id.value.hashID.value.idString
                    const assetIdData = clasificationID + '|' + hashID;
                    const spliturl = buyAssetSplitsURL();
                    axios.get(spliturl).then(
                      (splitresponse)=>{
                        const splitlist =  splitresponse.data.result.value.splits.value.list;
                        splitlist.map(function(splititem) {
                          const splitvalue = splititem.value.id.value.ownableID.value.idString;
                          if(splitvalue === assetIdData){
                            var fromIdData = splititem.value.id.value.ownerID.value.idString;
                            if(fromIdData === "orders"){
                              const orderAsseturl = assetOrderURL();     
                              axios.get(orderAsseturl).then(
                                (orderAssetItem)=>{
                                    const orderAssetItemList = orderAssetItem.data.result.value.orders.value.list;
                                    orderAssetItemList.map(function(item) {
                                      if(item.value.immutables.value.properties.value.propertyList[0].value.id.value.idString === "Name"){
                                       const hash = item.value.immutables.value.properties.value.propertyList[0].value.fact.value.hash;
                                       const hashurl = buyAssetHashURL(hash);
                                       axios.get(hashurl).then(
                                        (hashresponse)=>{
                                          const orderAssetItem = hashresponse.data.result.value.metas.value.list[0].value.data.value.value;
                                          if(orderAssetItem === selectValue){
                                            fromIdData = item.value.id.value.makerID.value.idString;
                                            postOrderCancel(fromIdData);
                                            return fromIdData;
                                          }
                                        })
                                    }
                                    return "";
                                })
                            })
                          }
                          else{
                            postOrderCancel(fromIdData);
                          }
                         
                          function postOrderCancel(fromIdDatad){
                            const orderAsseturl = assetOrderURL();     
                            axios.get(orderAsseturl).then(
                              (orderAssetItem)=>{
                                  const orderAssetItemList = orderAssetItem.data.result.value.orders.value.list;
                                  orderAssetItemList.forEach((item) => {
                                    if(item.value.immutables.value.properties.value.propertyList[0].value.id.value.idString === "Name"){
                                     const hash = item.value.immutables.value.properties.value.propertyList[0].value.fact.value.hash;
                                     const hashurl = buyAssetHashURL(hash);
                                     axios.get(hashurl).then(
                                      (hashresponse)=>{
                                        const orderAssetItem = hashresponse.data.result.value.metas.value.list[0].value.data.value.value;
                                        if(orderAssetItem === selectValue){
                                         const clasificationID = item.value.id.value.classificationID.value.idString
                                         const makerownableid = item.value.id.value.makerOwnableID.value.idString
                                         const takerownableid = item.value.id.value.takerOwnableID.value.idString
                                         const makerID = item.value.id.value.makerID.value.idString
                                         const hashID = item.value.id.value.hashID.value.idString
                                         const orderIdData = clasificationID + '*' + makerownableid + '*' + takerownableid + '*' + makerID + '*' + hashID
                                             const formData = {
                                                type:"/xprt/orders/cancel/request",
                                                value:{
                                                baseReq:{
                                                from:"cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                                chain_id:"test"
                                            },
                                            fromID:fromIdDatad,
                                            orderID:orderIdData,
                                            }
                                            }
                                            console.log(formData)
                                            const orderCancelurl = OrderCancelURL();
                                            axios.post(orderCancelurl, formData)
                                            .then((response) => {
                                                setLoader(false);
                                                setShow(true);
                                                setResponseData(response.data.txhash)
                                            }).catch((error) =>{ 
                                                setLoader(false);
                                                setShow(true);
                                                setErrorData(error.response
                                                  ? error.response.data.error.message
                                                  : error.message)
                                            });
                                        }
                                      })
                                  }
                                  return "";
                              })
                          })
  
                          }
                       
                        }
                        return "";
                      }
                    )
                  }
                )
              }
            })
         
          }
          return "";
        }
      )
    })
    }
  return (
    <div className="accountInfo">
          {
        loading ?
        <div className="loader">
          <img src={loader} alt="loader" />
          </div>
        :
        ""
    }
    <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
    <div className="col-md-6 custom-pad signup-box">
    <Form onSubmit = { handleSubmit }>  
        <h4 className="formTitle">Order Cancel</h4>
        <AssetsDropdown />
        <div className="submitButtonSection">
        <Button variant="primary" type="submit">
        Submit
        </Button>
        </div>
    </Form>
    </div>
    </div>
    <Modal show={show} onHide={handleClose} className="accountInfoModel" centered>
        <Modal.Header>
        { !errorData ?
            <div className="icon success-icon">
                <i className="mdi mdi-check"></i>
            </div>
          :
          <div className="icon failure-icon">
                <i class="mdi mdi-close"></i>
            </div>
            }
        </Modal.Header>
        <Modal.Body>   
            { !errorData ?
                <div>
                    <div className="content">
                    <p>Order Cancled.</p>
                    <p className="modal-tx-hash">tx Hash:{responseData}</p>
                    </div>
                </div>
                    :
                  <div className="error-box">
                      <div className="content">
                       <p>{errorData}</p>
                      </div>
                  </div>
            }
          </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose} >
            ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrderCancel;
