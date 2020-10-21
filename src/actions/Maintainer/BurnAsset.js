import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  assetBurnURL,
  assetOrderURL,
  buyAssetHashURL,
  assetsURL,
  buyAssetSplitsURL,
} from "../../constants/url";
import { Form, Button, Modal } from "react-bootstrap";
import loader from "../../assets/images/loader.svg";

const BurnAsset = () => {
  const [loading, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [errorData, setErrorData] = useState("");
  const [responseData, setResponseData] = useState("");

  const [buyAsset, setbuyAsset] = useState("");
  const [assetItemList, setAssetItemList] = useState([]);
  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  useEffect(() => {
    const fetchAssetUrl = assetsURL();
    const fetchList = async () => {
      const response = await axios.get(fetchAssetUrl);
      const listData = response.data.result.value.assets.value.list;
      if (listData !== null) {
        listData.forEach((item) => {
          if (
            item.value.immutables.value.properties.value.propertyList[0].value
              .id.value.idString === "Name"
          ) {
            const hash =
              item.value.immutables.value.properties.value.propertyList[0].value
                .fact.value.hash;

            const clasificationID =
              item.value.id.value.classificationID.value.idString;
            const hashID = item.value.id.value.hashID.value.idString;
            const res = clasificationID + "|" + hashID;

            const splitUrl = buyAssetSplitsURL();
            axios.get(splitUrl).then((splitResponse) => {
              const splitList =
                splitResponse.data.result.value.splits.value.list;
              splitList.forEach((splitItem) => {
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
                      setAssetItemList((assetItemList) => [
                        ...assetItemList,
                        listname,
                      ]);
                    });
                  }
                }
              });
            });
          }
        });
      }
    };
    fetchList();
  }, []);
  const handleSubmit = (event) => {
    setLoader(true);
    event.preventDefault();
    const selectValue = event.target.selectChange.value;
    const fromIDurl = assetsURL();
    axios.get(fromIDurl).then((responseidentities) => {
      const assetList = responseidentities.data.result.value.assets.value.list;
      assetList.forEach((asset) => {
        if (
          asset.value.immutables.value.properties.value.propertyList[0].value.id
            .value.idString === "Name"
        ) {
          const assetHash =
            asset.value.immutables.value.properties.value.propertyList[0].value
              .fact.value.hash;
          const assetHashUrl = buyAssetHashURL(assetHash);
          axios.get(assetHashUrl).then((hashresponse) => {
            const listname2 =
              hashresponse.data.result.value.metas.value.list[0].value.data
                .value.value;
            if (listname2 === selectValue) {
              const clasificationID =
                asset.value.id.value.classificationID.value.idString;
              const hashID = asset.value.id.value.hashID.value.idString;
              const assetIdData = clasificationID + "|" + hashID;
              const splitUrl = buyAssetSplitsURL();
              axios.get(splitUrl).then((splitResponse) => {
                const splitList =
                  splitResponse.data.result.value.splits.value.list;
                splitList.forEach((splitItem) => {
                  const splitvalue =
                    splitItem.value.id.value.ownableID.value.idString;
                  if (splitvalue === assetIdData) {
                    var fromIdData =
                      splitItem.value.id.value.ownerID.value.idString;
                    if (fromIdData === "orders") {
                      const orderAssetUrl = assetOrderURL();
                      axios.get(orderAssetUrl).then((orderAssetItem) => {
                        const orderList =
                          orderAssetItem.data.result.value.orders.value.list;
                        orderList.forEach((order) => {
                          if (
                            order.value.immutables.value.properties.value
                              .propertyList[0].value.id.value.idString ===
                            "Name"
                          ) {
                            const orderHash =
                              order.value.immutables.value.properties.value
                                .propertyList[0].value.fact.value.hash;
                            const orderHashurl = buyAssetHashURL(orderHash);
                            axios
                              .get(orderHashurl)
                              .then((orderHashResponse) => {
                                const orderAssetItemValue =
                                  orderHashResponse.data.result.value.metas
                                    .value.list[0].value.data.value.value;
                                if (orderAssetItemValue === selectValue) {
                                  fromIdData =
                                    order.value.id.value.makerID.value.idString;
                                  postAsset(fromIdData);
                                  return fromIdData;
                                }
                              });
                          }
                        });
                      });
                    } else {
                      postAsset(fromIdData);
                    }

                    function postAsset(fromIdDatad) {
                      const formData = {
                        type: "/xprt/assets/burn/request",
                        value: {
                          baseReq: {
                            from:
                              "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                            chain_id: "test",
                          },
                          fromID: fromIdDatad,
                          assetID: assetIdData,
                        },
                      };
                      const assetBurnPosturl = assetBurnURL();
                      axios
                        .post(assetBurnPosturl, formData)
                        .then((response) => {
                          setShow(true);
                          setLoader(false);
                          setResponseData(response.data.txhash);
                        })
                        .catch((error) => {
                          setShow(true);
                          setLoader(false);
                          setErrorData(
                            error.response
                              ? error.response.data.error.message
                              : error.message
                          );
                        });
                    }
                  }
                });
              });
            }
          });
        }
      });
    });
  };
  const handleSelectChange = (evt) => {
    setbuyAsset(evt.target.value);
  };
  return (
    <div className="accountInfo">
      {loading ? (
        <div className="loader">
          <img src={loader} alt="loader" />
        </div>
      ) : (
        ""
      )}
      <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
        <div className="col-md-6 custom-pad signup-box">
          <Form onSubmit={handleSubmit}>
            <h4 className="formTitle">Burn Asset</h4>
            <Form.Label>Select Asset</Form.Label>
            <Form.Control
              as="select"
              name="selectChange"
              value={buyAsset}
              onChange={handleSelectChange}
            >
              {assetItemList.map((asset, index) => {
                return (
                  <option key={index} value={asset}>
                    {asset}
                  </option>
                );
              })}
            </Form.Control>
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
                <p>Burn Asset Successful.</p>
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
  );
};

export default BurnAsset;
