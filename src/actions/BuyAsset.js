import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
import {
  assetOrderURL,
  buyAssetHashURL,
  orderTakeURL,
  assetsURL,
  buyAssetSplitsURL,
} from "../constants/url";
import loader from "../assets/images/loader.svg";
import AssetsDropdown from "../constants/AssetsDropdownList";

const BuyAsset = () => {
  const history = useHistory();
  const [responseData, setResponseData] = useState("");
  const [loading, setLoader] = useState(false);
  const [errorData, setErrorData] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    const inputAssetValue = event.target.selectChange.value;
    const fetchAssetsUrl = assetsURL();
    axios.get(fetchAssetsUrl).then((assetListResponse) => {
      const assetList = assetListResponse.data.result.value.assets.value.list;
      if (assetList !== null) {
        assetList.forEach((assetListItem) => {
          if (
            assetListItem.value.immutables.value.properties.value
              .propertyList[0].value.id.value.idString === "Name"
          ) {
            const assetListHash =
              assetListItem.value.immutables.value.properties.value
                .propertyList[0].value.fact.value.hash;
            const assetListHashurl = buyAssetHashURL(assetListHash);
            axios.get(assetListHashurl).then((assetListHashresponse) => {
              const hashListValue =
                assetListHashresponse.data.result.value.metas.value.list[0]
                  .value.data.value.value;
              if (hashListValue === inputAssetValue) {
                const hashClasificationId =
                  assetListItem.value.id.value.classificationID.value.idString;
                const hashID =
                  assetListItem.value.id.value.hashID.value.idString;
                const res = hashClasificationId + "|" + hashID;
                const splitUrl = buyAssetSplitsURL();
                axios.get(splitUrl).then((splitResponse) => {
                  const splitList =
                    splitResponse.data.result.value.splits.value.list;
                  if (splitList !== null) {
                    splitList.forEach((splitItem) => {
                      const splitValue =
                        splitItem.value.id.value.ownableID.value.idString;
                      if (splitValue === res) {
                        var fromIdData =
                          splitItem.value.id.value.ownerID.value.idString;
                        if (fromIdData === "orders") {
                          const orderAsseturl = assetOrderURL();
                          axios
                            .get(orderAsseturl)
                            .then((orderAssetItemResponse) => {
                              const orderAssetItemList =
                                orderAssetItemResponse.data.result.value.orders
                                  .value.list;
                              orderAssetItemList.forEach((orderAssetItem) => {
                                if (
                                  orderAssetItem.value.immutables.value
                                    .properties.value.propertyList[0].value.id
                                    .value.idString === "Name"
                                ) {
                                  const hash =
                                    orderAssetItem.value.immutables.value
                                      .properties.value.propertyList[0].value
                                      .fact.value.hash;
                                  const hashurl = buyAssetHashURL(hash);
                                  axios.get(hashurl).then((hashresponse) => {
                                    const orderAssetItemValue =
                                      hashresponse.data.result.value.metas.value
                                        .list[0].value.data.value.value;
                                    if (
                                      orderAssetItemValue === inputAssetValue
                                    ) {
                                      fromIdData =
                                        orderAssetItem.value.id.value.makerID
                                          .value.idString;
                                      postOrderCancel(fromIdData);
                                    }
                                  });
                                }
                              });
                            });
                        } else {
                          postOrderCancel(fromIdData);
                        }

                        function postOrderCancel(fromIdDatad) {
                          const orderAsseturl = assetOrderURL();
                          axios
                            .get(orderAsseturl)
                            .then((orderAssetItemResponse2) => {
                              const orderAssetItemList2 =
                                orderAssetItemResponse2.data.result.value.orders
                                  .value.list;
                              orderAssetItemList2.forEach((
                                orderAssetItem2
                              ) => {
                                if (
                                  orderAssetItem2.value.immutables.value
                                    .properties.value.propertyList[0].value.id
                                    .value.idString === "Name"
                                ) {
                                  const hash2 =
                                    orderAssetItem2.value.immutables.value
                                      .properties.value.propertyList[0].value
                                      .fact.value.hash;
                                  const hashurl2 = buyAssetHashURL(hash2);
                                  axios.get(hashurl2).then((hashresponse2) => {
                                    const orderAssetItemValue2 =
                                      hashresponse2.data.result.value.metas
                                        .value.list[0].value.data.value.value;
                                    if (
                                      orderAssetItemValue2 === inputAssetValue
                                    ) {
                                      const clasificationID =
                                        orderAssetItem2.value.id.value
                                          .classificationID.value.idString;
                                      const makerownableid =
                                        orderAssetItem2.value.id.value
                                          .makerOwnableID.value.idString;
                                      const takerownableid =
                                        orderAssetItem2.value.id.value
                                          .takerOwnableID.value.idString;
                                      const makerID =
                                        orderAssetItem2.value.id.value.makerID
                                          .value.idString;
                                      const hashID2 =
                                        orderAssetItem2.value.id.value.hashID
                                          .value.idString;
                                      const orderIdData =
                                        clasificationID +
                                        "*" +
                                        makerownableid +
                                        "*" +
                                        takerownableid +
                                        "*" +
                                        makerID +
                                        "*" +
                                        hashID2;
                                      const formData = {
                                        type: "/xprt/orders/take/request",
                                        value: {
                                          baseReq: {
                                            from:
                                              "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                            chain_id: "test",
                                          },
                                          fromID: fromIdDatad,
                                          takerOwnableSplit:
                                            "0.000000000000000001",
                                          orderID: orderIdData,
                                        },
                                      };
                                      const orderTakeUrl = orderTakeURL();
                                      axios
                                        .post(orderTakeUrl, formData)
                                        .then((response) => {
                                          setShow(true);
                                          setLoader(false);
                                          setResponseData(response.data.txhash);
                                        })
                                        .catch((error) => {
                                          setShow(true);
                                          setLoader(false);
                                          setErrorData("");
                                        });
                                    }
                                  });
                                }
                              });
                            });
                        }
                      }
                    });
                  }
                });
              }
            });
          }
          return "";
        });
      }
    });
    event.target.reset();
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loader">
          <img src={loader} alt="loader" />
        </div>
      ) : (
        ""
      )}
      <div className="accountInfo">
        <button onClick={() => history.goBack()} className="btn btn-secondary">
          back
        </button>
        <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
          <div className="col-md-6 custom-pad signup-box">
            <Form onSubmit={handleSubmit}>
              <h4 className="formTitle">Buy Asset</h4>
              <AssetsDropdown />
              <div className="submitButtonSection">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          className="accountInfoModel"
          centered
        >
          <Modal.Header>
            {!errorData ? (
              <div className="icon success-icon">
                <i className="mdi mdi-check"></i>
              </div>
            ) : (
              <div className="icon failure-icon">
                <i class="mdi mdi-close"></i>
              </div>
            )}
          </Modal.Header>
          <Modal.Body>
            {!errorData ? (
              <div>
                <div className="content">
                  <p>Txs Successfull</p>
                  <p className="modal-tx-hash">tx Hash:{responseData}</p>
                </div>
              </div>
            ) : (
              <div className="error-box">
                <div className="content">
                  <p>{errorData}</p>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              ok
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
export default BuyAsset;
