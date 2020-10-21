import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  assetBurnURL,
  assetOrderURL,
  classificationsURL,
  buyAssetHashURL,
  assetsURL,
  buyAssetSplitsURL,
  deputizeURL,
  maintainersURL,
} from "../../constants/url";
import { Form, Button, Modal } from "react-bootstrap";
import loader from "../../assets/images/loader.svg";

const MutateAsset = () => {
  const [loading, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [errorData, setErrorData] = useState("");
  const [assetItemsList, setAssetItemsList] = useState([]);
  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  useEffect(() => {
    const fetchAssetUrl = assetsURL();
    const fetchList = async () => {
      const response = await axios.get(fetchAssetUrl);
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
                const splitItemValue =
                  splitItem.value.id.value.ownableID.value.idString;
                if (splitItemValue === res) {
                  var ownerID = splitItem.value.id.value.ownerID.value.idString;
                  if (ownerID !== "orders") {
                    const hashurl = buyAssetHashURL(hash);
                    axios.get(hashurl).then((hashresponse) => {
                      const listname =
                        hashresponse.data.result.value.metas.value.list[0].value
                          .data.value.value;
                      // setAssetList(asssetItemList);
                      setAssetItemsList((assetItemsList) => [
                        ...assetItemsList,
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
    const popularity = event.target.popularity.value;
    const satisfaction = event.target.satisfaction.value;
    setLoader(true);
    event.preventDefault();
    const selectValue = event.target.selectChange.value;
    const fetchAssetsUrl = assetsURL();
    axios.get(fetchAssetsUrl).then((assetsResponse) => {
      const assetList = assetsResponse.data.result.value.assets.value.list;
      assetList.forEach((asset) => {
        if (
          asset.value.immutables.value.properties.value.propertyList[0].value.id
            .value.idString === "Name"
        ) {
          const hash =
            asset.value.immutables.value.properties.value.propertyList[0].value
              .fact.value.hash;
          const hashurl = buyAssetHashURL(hash);
          axios.get(hashurl).then((hashresponse) => {
            const metaValue =
              hashresponse.data.result.value.metas.value.list[0].value.data
                .value.value;
            if (metaValue === selectValue) {
              const clasificationID =
                asset.value.id.value.classificationID.value.idString;
              const hashID = asset.value.id.value.hashID.value.idString;
              const assetIdData = clasificationID + "|" + hashID;
              const deputizesplitUrl = buyAssetSplitsURL();
              axios.get(deputizesplitUrl).then((deputizeSplitResponse) => {
                const deputizeSplitList =
                  deputizeSplitResponse.data.result.value.splits.value.list;
                deputizeSplitList.forEach((deputizeSplitItem) => {
                  if (
                    deputizeSplitItem.value.id.value.ownableID.value
                      .idString === assetIdData
                  ) {
                    const deputizetoID =
                      deputizeSplitItem.value.id.value.ownerID.value.idString;
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
                                .properties.value.propertyList[0].value.id.value
                                .idString === "Name" &&
                              clasificationItem.value.immutableTraits.value
                                .properties.value.propertyList[1].value.id.value
                                .idString === "Des"
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
                              const maintainersAssetUrl = maintainersURL();
                              axios
                                .get(maintainersAssetUrl)
                                .then((responseMaintainersAsset) => {
                                  const maintainersAssetList =
                                    responseMaintainersAsset.data.result.value
                                      .maintainers.value.list;
                                  var count = 0;
                                  var deputizeFromIdData = "";
                                  maintainersAssetList.forEach(
                                    (maintainersAssetItem) => {
                                      if (
                                        maintainersAssetItem.value.id.value
                                          .classificationID.value.idString ===
                                        classificationIdData
                                      ) {
                                        deputizeFromIdData =
                                          maintainersAssetItem.value.id.value
                                            .identityID.value.idString;
                                        if (
                                          deputizetoID === deputizeFromIdData
                                        ) {
                                          count++;
                                          return count;
                                        }
                                      }
                                    }
                                  );
                                  if (count === 0) {
                                    const formDeputizeData = {
                                      type:
                                        "/xprt/maintainers/deputize/request",
                                      value: {
                                        baseReq: {
                                          from:
                                            "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                          chain_id: "test",
                                        },
                                        toID: deputizetoID,
                                        classificationID: classificationIdData,
                                        fromID: deputizeFromIdData,
                                        maintainedTraits:
                                          "CustSatisfaction:S|,Popularity:S|,burn:H|1",
                                        addMaintainer: true,
                                        removeMaintainer: true,
                                        mutateMaintainer: true,
                                      },
                                    };
                                    const deputizePosturl = deputizeURL();
                                    axios
                                      .post(deputizePosturl, formDeputizeData)
                                      .then((response) => {
                                        setTimeout(mutateAsset, 5000);
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
                                  } else {
                                    mutateAsset();
                                  }
                                  function mutateAsset() {
                                    const spliturl = buyAssetSplitsURL();
                                    axios
                                      .get(spliturl)
                                      .then((splitresponse) => {
                                        const splitlist =
                                          splitresponse.data.result.value.splits
                                            .value.list;
                                        splitlist.forEach((splitItem) => {
                                          const splitValue =
                                            splitItem.value.id.value.ownableID
                                              .value.idString;
                                          if (splitValue === assetIdData) {
                                            var fromIdData =
                                              splitItem.value.id.value.ownerID
                                                .value.idString;
                                            if (fromIdData === "orders") {
                                              const orderAsseturl = assetOrderURL();
                                              axios
                                                .get(orderAsseturl)
                                                .then(
                                                  (orderAssetItemResponse) => {
                                                    const orderAssetItemList =
                                                      orderAssetItemResponse
                                                        .data.result.value
                                                        .orders.value.list;
                                                    orderAssetItemList.forEach(
                                                      (orderAssetItem) => {
                                                        if (
                                                          orderAssetItem.value
                                                            .immutables.value
                                                            .properties.value
                                                            .propertyList[0]
                                                            .value.id.value
                                                            .idString === "Name"
                                                        ) {
                                                          const hash =
                                                            orderAssetItem.value
                                                              .immutables.value
                                                              .properties.value
                                                              .propertyList[0]
                                                              .value.fact.value
                                                              .hash;
                                                          const hashurl = buyAssetHashURL(
                                                            hash
                                                          );
                                                          axios
                                                            .get(hashurl)
                                                            .then(
                                                              (
                                                                hashresponse
                                                              ) => {
                                                                const orderAssetMetaValue =
                                                                  hashresponse
                                                                    .data.result
                                                                    .value.metas
                                                                    .value
                                                                    .list[0]
                                                                    .value.data
                                                                    .value
                                                                    .value;
                                                                if (
                                                                  orderAssetMetaValue ===
                                                                  selectValue
                                                                ) {
                                                                  fromIdData =
                                                                    orderAssetItem
                                                                      .value.id
                                                                      .value
                                                                      .makerID
                                                                      .value
                                                                      .idString;
                                                                  postAssetMutate(
                                                                    fromIdData
                                                                  );
                                                                  return fromIdData;
                                                                }
                                                              }
                                                            );
                                                        }
                                                      }
                                                    );
                                                  }
                                                );
                                            } else {
                                              postAssetMutate(fromIdData);
                                            }

                                            function postAssetMutate(
                                              fromIdDatad
                                            ) {
                                              const formData = {
                                                type:
                                                  "/xprt/assets/mutate/request",
                                                value: {
                                                  baseReq: {
                                                    from:
                                                      "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                                    chain_id: "test",
                                                  },
                                                  fromID: deputizetoID,
                                                  assetID: assetIdData,
                                                  mutableMetaProperties: `CustSatisfaction:S|${satisfaction},burn:H|1`,
                                                  mutableProperties: `Popularity:S|${popularity}`,
                                                },
                                              };
                                              const assetBurnPosturl = assetBurnURL();
                                              axios
                                                .post(
                                                  assetBurnPosturl,
                                                  formData
                                                )
                                                .then((response) => {
                                                  setShow(true);
                                                  setLoader(false);
                                                  setResponseData(
                                                    response.data.txhash
                                                  );
                                                })
                                                .catch((error) => {
                                                  setShow(true);
                                                  setLoader(false);
                                                  setErrorData(
                                                    error.response
                                                      ? error.response.data
                                                          .error.message
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
                          }
                        );
                      });
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
            <h4 className="formTitle">Mutate Asset</h4>
            <Form.Label>Select Asset</Form.Label>
            <Form.Control as="select" name="selectChange">
              {assetItemsList.map((asset, index) => {
                return (
                  <option key={index} value={asset}>
                    {asset}
                  </option>
                );
              })}
            </Form.Control>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Popularity</Form.Label>
              <Form.Control as="select" name="popularity">
                <option value="alwaysPopular">Always Popular</option>
                <option value="Very">Very</option>
                <option value="NotMuch">Not much</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Customer Satisfaction</Form.Label>
              <Form.Control as="select" name="satisfaction">
                <option value="Good">Good</option>
                <option value="Happy">Happy</option>
                <option value="NotSatisfied">NotSatisfied</option>
              </Form.Control>
            </Form.Group>
            <div className="submitButtonSection">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
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
                  <p>Mutate Asset Successful.</p>
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

export default MutateAsset;
