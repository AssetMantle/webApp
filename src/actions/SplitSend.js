import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
import {
  buyAssetHashURL,
  assetsURL,
  splitSendURL,
  buyAssetSplitsURL,
  buyAssetIdentitiesURL,
  splitWrapURL,
} from "../constants/url";
import loader from "../assets/images/loader.svg";

const SplitSend = () => {
  const history = useHistory();
  const [buyAsset, setbuyAsset] = useState("");
  const [assetItemList, setAssetItemList] = useState([]);
  const [toIDList, settoIDList] = useState([]);
  const [responseData, setResponseData] = useState("");
  // const [assetResponse, setAssetResponse] = useState({});
  const [toIdData, settoIdData] = useState({});
  const [loading, setLoader] = useState(false);
  const [errorData, setErrorData] = useState("");
  const [buytoID, setbuytoID] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  const fetchtoIdList = async () => {
    const fetchtoIdListUrl = buyAssetIdentitiesURL();
    const response = await axios.get(fetchtoIdListUrl);
    const toIdResponseList = response.data.result.value.identities.value.list;
    toIdResponseList.forEach((toIdResponseItem) => {
      if (
        toIdResponseItem.value.immutables.value.properties.value.propertyList
          .length > 2 &&
        toIdResponseItem.value.immutables.value.properties.value.propertyList[2]
          .value.id.value.idString === "Name"
      ) {
        const hash =
          toIdResponseItem.value.immutables.value.properties.value
            .propertyList[2].value.fact.value.hash;
        settoIdData(toIdResponseList);
        const hashurl = buyAssetHashURL(hash);
        axios.get(hashurl).then((hashresponse) => {
          const toIdItemName =
            hashresponse.data.result.value.metas.value.list[0].value.data.value
              .value;
          settoIDList((toIDList) => [...toIDList, toIdItemName]);
        });
      }
    });
  };
  const fetchList = async () => {
    const fetchAssetUrl = assetsURL();
    const response = await axios.get(fetchAssetUrl);
    const assetListData = response.data.result.value.assets.value.list;
    if (assetListData !== null) {
      assetListData.forEach((asset) => {
        if (
          asset.value.immutables.value.properties.value.propertyList[0].value.id
            .value.idString === "Name"
        ) {
          // setAssetResponse(asset);
          const hash =
          asset.value.immutables.value.properties.value.propertyList[0].value
              .fact.value.hash;
          const clasificationID =
          asset.value.id.value.classificationID.value.idString;
          const hashID = asset.value.id.value.hashID.value.idString;
          const res = clasificationID + "|" + hashID;

          const spliturl = buyAssetSplitsURL();
          axios.get(spliturl).then((splitresponse) => {
            const splitlist = splitresponse.data.result.value.splits.value.list;
            splitlist.forEach((splitItem) => {
              const splitValue =
              splitItem.value.id.value.ownableID.value.idString;
              if (splitValue === res) {
                var ownerID = splitItem.value.id.value.ownerID.value.idString;
                if (ownerID !== "orders") {
                  const hashurl = buyAssetHashURL(hash);
                  axios.get(hashurl).then((hashresponse) => {
                    const listname =
                      hashresponse.data.result.value.metas.value.list[0].value
                        .data.value.value;
                        setAssetItemList((assetItemList) => [...assetItemList, listname]);
                  });
                }
              }
            });
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchList();
    fetchtoIdList();
  }, []);

  const handleSubmit = (event) => {
    setLoader(true);
    event.preventDefault();
    const inputAssetValue = event.target.selectNameChange.value;
    const inputAssetToValue = event.target.selecttoIDChange.value;
    const fetchAssetUrl = assetsURL();
    axios.get(fetchAssetUrl).then((assetResponse) => {
      const assetItemList =
        assetResponse.data.result.value.assets.value.list;
      if (assetItemList !== null) {
        assetItemList.forEach((asset) => {
          if (
            asset.value.immutables.value.properties.value.propertyList[0].value
              .id.value.idString === "Name"
          ) {
            const assetHash =
            asset.value.immutables.value.properties.value.propertyList[0].value
                .fact.value.hash;
            const assetHashUrl = buyAssetHashURL(assetHash);
            axios.get(assetHashUrl).then((assetHashResponse) => {
              const hashValue =
              assetHashResponse.data.result.value.metas.value.list[0].value.data
                  .value.value;
              if (hashValue === inputAssetValue) {
                const clasificationID =
                asset.value.id.value.classificationID.value.idString;
                const hashID = asset.value.id.value.hashID.value.idString;
                const ownableId = clasificationID + "|" + hashID;
                const fetchSplitUrl = buyAssetSplitsURL();
                axios.get(fetchSplitUrl).then((splitResponse) => {
                  const splitList =
                  splitResponse.data.result.value.splits.value.list;
                  splitList.forEach((splitItem) => {
                    const splitValue =
                    splitItem.value.id.value.ownableID.value.idString;
                    if (splitValue === ownableId) {
                      var fromIdData =
                      splitItem.value.id.value.ownerID.value.idString;
                      if (fromIdData === "orders") {
                        assetItemList.forEach((asset) => {
                          if (asset === inputAssetValue) {
                            fromIdData =
                              assetResponse.value.id.value.makerID.value
                                .idString;
                            return fromIdData;
                          }
                        });
                      }

                        toIdData.forEach((toIdResponseItem) => {
                        if (
                          toIdResponseItem.value.immutables.value.properties
                            .value.propertyList.length > 2 &&
                          toIdResponseItem.value.immutables.value.properties
                            .value.propertyList[2].value.id.value.idString ===
                            "Name"
                        ) {
                          const toIdHash =
                            toIdResponseItem.value.immutables.value.properties
                              .value.propertyList[2].value.fact.value.hash;
                          const toIdHashUrl = buyAssetHashURL(toIdHash);
                          axios.get(toIdHashUrl).then((toIdHashResponse) => {
                            const toIdItem =
                            toIdHashResponse.data.result.value.metas.value.list[0]
                                .value.data.value.value;
                            if (toIdItem === inputAssetToValue) {
                              const toClassificationId =
                                toIdResponseItem.value.id.value.classificationID
                                  .value.idString;
                              const toHashId =
                                toIdResponseItem.value.id.value.hashID.value
                                  .idString;
                              const toID = toClassificationId + "|" + toHashId;

                              
                              const formData = {
                                type: "/xprt/splits/send/request",
                                value: {
                                  baseReq: {
                                    from:
                                      "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                    chain_id: "test",
                                  },
                                  fromID: fromIdData,
                                  toID: toID,
                                  ownableID: ownableId,
                                  split: "0.000000000000000001",
                                },
                              };
                      
                              const wrapData = {
                                type: "/xprt/splits/wrap/request",
                                value: {
                                  baseReq: {
                                    from:
                                      "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                    chain_id: "test",
                                  },
                                  fromID: fromIdData,
                                  coins: "100000stake",
                                },
                              };

                              const splitWrapPostUrl = splitWrapURL();
                              axios
                                .post(splitWrapPostUrl, wrapData)
                                .then((response) => {
                                  setTimeout(splitSend, 2000);
                                })
                                .catch((error) => {
                                });
                              function splitSend() {
                                const spliSendPostUrl = splitSendURL();
                                axios
                                  .post(spliSendPostUrl, formData)
                                  .then((response) => {
                                    setLoader(false);
                                    setShow(true);
                                    setResponseData(response.data.txhash);
                                  })
                                  .catch((error) => {
                                    setLoader(false);
                                    setShow(true);
                                    setErrorData(
                                      error.response
                                        ? error.response.data.error.message
                                        : error.message
                                    );
                                  });
                              }
                            }
                          });
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
    event.target.reset();
  };

  const handleSelectChangeAsset = (evt) => {
    setbuyAsset(evt.target.value);
  };
  const handleSelectChangetoID = (evt) => {
    setbuytoID(evt.target.value);
  };

  return (
    <div className="container">
      {" "}
      {loading ? (
        <div className="loader">
          <img src={loader} alt="loader" />
        </div>
      ) : (
        ""
      )}
      <div className="accountInfo">
        <button onClick={() => history.goBack()} className="btn btn-secondary">
          {" "}
          back{" "}
        </button>
        <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
          <div className="col-md-6 custom-pad signup-box">
            <Form onSubmit={handleSubmit}>
              <h4 className="formTitle"> Split Asset </h4>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label> Select Asset </Form.Label>
                <Form.Control
                  as="select"
                  name="selectNameChange"
                  value={buyAsset}
                  onChange={handleSelectChangeAsset}
                >
                  {assetItemList.map((asset, index) => {
                    return (
                      <option key={index} value={asset}>
                        {asset}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label> Select toID </Form.Label>
                <Form.Control
                  as="select"
                  name="selecttoIDChange"
                  value={buytoID}
                  onChange={handleSelectChangetoID}
                >
                  {toIDList.map((toName, index) => {
                    return (
                      <option key={index} value={toName}>
                        {" "}
                        {toName}{" "}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>

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
            {" "}
            {!errorData ? (
              <div className="icon success-icon">
                <i className="mdi mdi-check"> </i>
              </div>
            ) : (
              <div className="icon failure-icon">
                <i class="mdi mdi-close"> </i>
              </div>
            )}
          </Modal.Header>
          <Modal.Body>
            {" "}
            {!errorData ? (
              <div>
                <div className="content">
                  <p> Split Successfull </p>
                  <p className="modal-tx-hash">tx Hash:{responseData}</p>
                </div>
              </div>
            ) : (
              <div className="error-box">
                <div className="content">
                  <p> {errorData} </p>
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
export default SplitSend;
