import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
import {
  senCoinURL,
  buyAssetIdentitiesURL,
  buyAssetHashURL,
} from "../constants/url";
import loader from "../assets/images/loader.svg";
const SendCoin = () => {
  const history = useHistory();
  const [loading, setLoader] = useState(false);
  const [errorData, setErrorData] = useState("");
  const [errorAmount, setErrorAmount] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [sumbitButtonState, setSumbitButtonState] = useState(true);
  const [show, setShow] = useState(false);
  const [toIDList, settoIDList] = useState([]);
  // const [toIdData , settoIdData] = useState({});
  const [buytoID, setbuytoID] = useState("");

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  const fetchtoIdList = async () => {
    const fetchtoIdListurl = buyAssetIdentitiesURL();
    const response = await axios.get(fetchtoIdListurl);
    const toIdResponseList = response.data.result.value.identities.value.list;
    if (toIdResponseList !== null) {
      toIdResponseList.forEach((toIdResponseItem) => {
        const toIdItemList =
          toIdResponseItem.value.immutables.value.properties.value.propertyList;
        toIdItemList.forEach((toIdItem) => {
          // settoIdData(toIdResponseItem);
          if (toIdItem.value.id.value.idString === "Name") {
            const hash = toIdItem.value.fact.value.hash;
            const hashurl = buyAssetHashURL(hash);
            axios.get(hashurl).then((hashresponse) => {
              const toIdItemName =
                hashresponse.data.result.value.metas.value.list[0].value.data
                  .value.value;
              settoIDList((toIDList) => [...toIDList, toIdItemName]);
            });
          }
        });
      });
    }
  };
  useEffect(() => {
    fetchtoIdList();
  }, []);
  const handleSubmit = (event) => {
    setLoader(true);
    event.preventDefault();
    const selectValue = event.target.selecttoIDChange.value;
    const amountData = event.target.amount.value;
    event.preventDefault();
    const fetchtoIdListurl = buyAssetIdentitiesURL();
    axios.get(fetchtoIdListurl).then((responseidentities) => {
      const toIdResponseList =
        responseidentities.data.result.value.identities.value.list;
      toIdResponseList.forEach((toIdResponseItem) => {
        const toIdPropertyList =
          toIdResponseItem.value.immutables.value.properties.value.propertyList;
        if (toIdPropertyList !== null) {
          toIdPropertyList.forEach((toIdPropertyItem) => {
            if (toIdPropertyItem.value.id.value.idString === "Name") {
              const toIdPropertyItemHash =
                toIdPropertyItem.value.fact.value.hash;
              const toIdPropertyItemHashUrl = buyAssetHashURL(
                toIdPropertyItemHash
              );
              axios
                .get(toIdPropertyItemHashUrl)
                .then((toIdPropertyListResponse) => {
                  const toIdMetaValue =
                    toIdPropertyListResponse.data.result.value.metas.value
                      .list[0].value.data.value.value;
                  if (toIdMetaValue === selectValue) {
                    const address =
                      toIdResponseItem.value.provisionedAddressList[0];
                    const sendCoinUrl = senCoinURL(address);
                    const formData = {
                      base_req: {
                        from: "cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                        chain_id: "test",
                      },
                      amount: [{ denom: "stake", amount: amountData }],
                    };
                    axios
                      .post(sendCoinUrl, formData)
                      .then((response) => {
                        setShow(true);
                        setLoader(false);
                        setAddress(address);
                      })
                      .catch((error) => {
                        setShow(true);
                        setLoader(false);
                        setErrorData(error.response.data.error);
                      });
                  }
                });
            }
          });
        }
      });
    });

    event.target.reset();
  };

  const handleAmountChange = (event) => {
    setErrorAmount("");
    const nameRe = /^[0-9\b]+$/;
    if (event.target.value === "" || nameRe.test(event.target.value)) {
      setSumbitButtonState(false);
      setAmount(event.target.value);
    } else {
      setSumbitButtonState(true);
      setErrorAmount("Enter Only Numbers");
    }
  };
  const handleSelectChangetoID = (evt) => {
    setbuytoID(evt.target.value);
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
              <h4 className="formTitle">SendCoin</h4>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>To Name</Form.Label>
                <Form.Control
                  as="select"
                  name="selecttoIDChange"
                  value={buytoID}
                  onChange={handleSelectChangetoID}
                >
                  {toIDList.map((toName, index) => {
                    return (
                      <option key={index} value={toName}>
                        {toName}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="text"
                  name="amount"
                  placeholder="Enter Amount"
                  required="true"
                  onChange={handleAmountChange}
                />
              </Form.Group>
              <p class="errorText"> {errorAmount}</p>
              <div className="submitButtonSection">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={sumbitButtonState}
                >
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
                  <p>Coin Sent Successfully.</p>
                  <p>To : {address}</p>
                  <p>Amount : {amount}</p>
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
export default SendCoin;
