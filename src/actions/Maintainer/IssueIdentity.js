import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import {
  buyAssetIdentitiesURL,
  buyAssetHashURL,
  classificationsURL,
  IssueIdentityURL,
} from "../../constants/url";
import loader from "../../assets/images/loader.svg";
const IssueIdentity = () => {
  const [loading, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [errorData, setErrorData] = useState("");
  const [responseData, setResponseData] = useState("");
  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  const handleSubmit = (event) => {
    setLoader(true);
    event.preventDefault();
    const name = event.target.name.value;
    const fetchIdentitiesUrl = buyAssetIdentitiesURL();
    axios.get(fetchIdentitiesUrl).then((identityResponse) => {
      const identitiesList =
      identityResponse.data.result.value.identities.value.list;
      identitiesList.forEach((identity) => {
        if (
          identity.value.immutables.value.properties.value
            .propertyList.length > 2 &&
            identity.value.immutables.value.properties.value
            .propertyList[2].value.id.value.idString === "Name"
        ) {
          const hash =
          identity.value.immutables.value.properties.value
              .propertyList[0].value.fact.value.hash;
          const hashurl = buyAssetHashURL(hash);
          axios.get(hashurl).then((hashresponse) => {
            const itemName =
              hashresponse.data.result.value.metas.value.list[0].value.data
                .value.value;
            if (itemName === name) {
              alert("Identity name already exists, pls try with a diff name");
            } else {
              axios.get(fetchIdentitiesUrl).then((responseidentities) => {
                const toIdResponseList =
                  responseidentities.data.result.value.identities.value.list;
                toIdResponseList.forEach((fromIdResponseItem) => {
                  // const fromIdItemList =
                  //   fromIdResponseItem.value.immutables.value.properties.value
                  //     .propertyList;
                  if (
                    fromIdResponseItem.value.immutables.value.properties.value
                      .propertyList[0].value.id.value.idString ===
                    "Organization"
                  ) {
                    const hash =
                      fromIdResponseItem.value.immutables.value.properties.value
                        .propertyList[2].value.fact.value.hash;
                    const hashurl = buyAssetHashURL(hash);
                    axios.get(hashurl).then((hashresponse) => {
                      const hashValue =
                        hashresponse.data.result.value.metas.value.list[0].value
                          .data.value.value;
                      if (hashValue === "John") {
                        const clasificationID =
                          fromIdResponseItem.value.id.value.classificationID
                            .value.idString;
                        const hashID =
                          fromIdResponseItem.value.id.value.hashID.value
                            .idString;
                        const fromIdData = clasificationID + "|" + hashID;
                        const classificationURL = classificationsURL();
                        axios
                          .get(classificationURL)
                          .then((clasificationResponse) => {
                            const clasificationResponseList =
                              clasificationResponse.data.result.value
                                .classifications.value.list;
                            clasificationResponseList.forEach((
                              clasificationItem
                            ) => {
                              var classificationIdData = "";
                              if (
                                clasificationItem.value.immutableTraits.value
                                  .properties.value.propertyList.length > 3 &&
                                clasificationItem.value.immutableTraits.value
                                  .properties.value.propertyList[2].value.id
                                  .value.idString === "Name" &&
                                clasificationItem.value.immutableTraits.value
                                  .properties.value.propertyList[0].value.id
                                  .value.idString === "Organization"
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

                                const formData = {
                                  type: "/xprt/identities/issue/request",
                                  value: {
                                    baseReq: {
                                      from:
                                        "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                      chain_id: "test",
                                    },
                                    fromID: fromIdData,
                                    classificationID: classificationIdData,
                                    to:
                                      "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                    immutableMetaProperties: `Organization:S|Persistence,DateOfJoining:S|8July2018,Name:S|${name}`,
                                    immutableProperties: `BelongTo:S|Earth,Birthday:S|22March1996`,
                                    mutableMetaProperties: `WorkingHours:S|12to9`,
                                    mutableProperties: `HolidaysTaken:S|4`,
                                  },
                                };
                                const issueIdentityURL = IssueIdentityURL();
                                axios
                                  .post(issueIdentityURL, formData)
                                  .then((response) => {
                                    setLoader(false);
                                    setShow(true);
                                    console.log(response.data.txhash);
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
                            });
                          });
                      }
                    });
                  }
                });
              });
            }
          });
        } else {
        }
      });
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
        <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
          <div className="col-md-6 custom-pad signup-box">
            <Form onSubmit={handleSubmit}>
              <h4 className="formTitle">Issue Identity</h4>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  required="true"
                />
                <Form.Text className="text-muted">
                  add a unique name like "John", "Joe".
                </Form.Text>
              </Form.Group>
              <div className="submitButtonSection">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
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
                <p>Asset Issued Successful.</p>
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

export default IssueIdentity;
