import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  classificationsURL,
  assetsURL,
  buyAssetHashURL,
  OrdreMakeURL,
  buyAssetSplitsURL,
} from "../../constants/url";
import loader from "../../assets/images/loader.svg";
import { Modal, Form, Button } from "react-bootstrap";
const OrderMake = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoader] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [errorData, setErrorData] = useState("");
  const [assetItemList, setAssetItemList] = useState([]);
  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  useEffect(() => {
    const fetchAssetsUrl = assetsURL();
    const fetchList = async () => {
      const response = await axios.get(fetchAssetsUrl);
      const assetList = response.data.result.value.assets.value.list;
      if (assetList !== null) {
        assetList.forEach((asset) => {
          if (
            asset.value.immutables.value.properties.value.propertyList[0].value
              .id.value.idString === "Name"
          ) {
            const hash =
              asset.value.immutables.value.properties.value.propertyList[0]
                .value.fact.value.hash;
            const clasificationID =
              asset.value.id.value.classificationID.value.idString;
            const hashID = asset.value.id.value.hashID.value.idString;
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
    const giftType = event.target.giftType.value;
    const giftName = event.target.giftName.value;
    const description = event.target.description.value;
    const fetchAssetsUrl = assetsURL();
    axios.get(fetchAssetsUrl).then((assetsResponse) => {
      const assetList = assetsResponse.data.result.value.assets.value.list;
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
              const assetClasificationID =
                asset.value.id.value.classificationID.value.idString;
              const assetHashID = asset.value.id.value.hashID.value.idString;
              const res = assetClasificationID + "|" + assetHashID;

              const splitUrl = buyAssetSplitsURL();
              axios.get(splitUrl).then((splitResponse) => {
                const splitList =
                  splitResponse.data.result.value.splits.value.list;
                splitList.forEach((splitItem) => {
                  const splitValue =
                    splitItem.value.id.value.ownableID.value.idString;
                  if (splitValue === res) {
                    var fromIdData =
                      splitItem.value.id.value.ownerID.value.idString;
                    // setfromassetId(fromIdData);
                    if (fromIdData !== "orders") {
                      const classificationURL = classificationsURL();
                      axios
                        .get(classificationURL)
                        .then((clasificationResponse) => {
                          const clasificationResponseList =
                            clasificationResponse.data.result.value
                              .classifications.value.list;
                          clasificationResponseList.forEach(
                            (clasificationItem) => {
                              var classificationIdData = "";
                              if (
                                clasificationItem.value.immutableTraits.value
                                  .properties.value.propertyList.length > 3 &&
                                clasificationItem.value.immutableTraits.value
                                  .properties.value.propertyList[0].value.id
                                  .value.idString === "Name" &&
                                clasificationItem.value.immutableTraits.value
                                  .properties.value.propertyList[3].value.id
                                  .value.idString === "Which Gifts"
                              ) {
                                const classificationchainID =
                                  clasificationItem.value.id.value.chainID.value
                                    .idString;
                                const classificationhashID =
                                  clasificationItem.value.id.value.hashID.value
                                    .idString;
                                classificationIdData =
                                  classificationchainID +
                                  "." +
                                  classificationhashID;
                                axios
                                  .get(fetchAssetsUrl)
                                  .then((assetsResponse2) => {
                                    const assetList2 =
                                      assetsResponse2.data.result.value.assets
                                        .value.list;
                                    assetList2.forEach((asset2) => {
                                      if (
                                        asset2.value.immutables.value.properties
                                          .value.propertyList[0].value.id.value
                                          .idString === "Name"
                                      ) {
                                        const asset2Hash =
                                          asset2.value.immutables.value
                                            .properties.value.propertyList[0]
                                            .value.fact.value.hash;
                                        const asset2Hashurl = buyAssetHashURL(
                                          asset2Hash
                                        );
                                        axios
                                          .get(asset2Hashurl)
                                          .then((asset2HashResponse) => {
                                            const hashListname =
                                              asset2HashResponse.data.result
                                                .value.metas.value.list[0].value
                                                .data.value.value;
                                            if (hashListname === selectValue) {
                                              const clasificationID =
                                                asset2.value.id.value
                                                  .classificationID.value
                                                  .idString;
                                              const hashID =
                                                asset2.value.id.value.hashID
                                                  .value.idString;
                                              const ownableID =
                                                clasificationID + "|" + hashID;
                                              const formData = {
                                                type:
                                                  "/xprt/orders/make/request",
                                                value: {
                                                  baseReq: {
                                                    from:
                                                      "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                                    chain_id: "test",
                                                  },
                                                  fromID: fromIdData,
                                                  classificationID: classificationIdData,
                                                  makerOwnableID: ownableID,
                                                  takerOwnableID: "stake",
                                                  expiresIn: "100000",
                                                  makerOwnableSplit:
                                                    "0.000000000000000001",
                                                  immutableMetaProperties: `Name:S|${selectValue},Gifts:S|Exchange,OrderID:S|12345`,
                                                  immutableProperties: `Which Gifts:S|${giftType},What Gifts:S|${giftName}`,
                                                  mutableMetaProperties:
                                                    "exchangeRate:D|1,makerSplit:D|0.000000000000000001",
                                                  mutableProperties: `descriptions:S|${description}`,
                                                },
                                              };

                                              const makeOrderUrl = OrdreMakeURL();
                                              axios
                                                .post(makeOrderUrl, formData)
                                                .then((response) => {
                                                  setLoader(false);
                                                  setShow(true);
                                                  setResponseData(
                                                    response.data.txhash
                                                  );
                                                })
                                                .catch((error) => {
                                                  setLoader(false);
                                                  setShow(true);
                                                  setErrorData(
                                                    error.response
                                                      ? error.response.data
                                                          .error.message
                                                      : error.message
                                                  );
                                                });
                                            }
                                          });
                                      }
                                    });
                                  });
                              }
                            }
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
        <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
          <div className="col-md-6 custom-pad signup-box">
            <Form onSubmit={handleSubmit}>
              <h4 className="formTitle">Make Order</h4>
              <Form.Label>Select Asset</Form.Label>
              <Form.Control as="select" name="selectChange">
                {assetItemList.map((asset, index) => {
                  return (
                    <option key={index} value={asset}>
                      {asset}
                    </option>
                  );
                })}
              </Form.Control>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Enter Description"
                  required="true"
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Which Gifts</Form.Label>
                <Form.Control as="select" name="giftType">
                  <option value="Christmas">Christmas</option>
                  <option value="ThanksGiving">Thanks giving</option>
                  <option value="Others">Others</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>What Gifts</Form.Label>
                <Form.Control as="select" name="giftName">
                  <option value="Furniture">Furniture</option>
                  <option value="DailyUse">Daily use</option>
                  <option value="Others">Others</option>
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
                  <p>Order Successful.</p>
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

export default OrderMake;
