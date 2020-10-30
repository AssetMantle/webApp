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

    };
    fetchList();
  }, []);

  const handleSubmit = (event) => {
    const popularity = event.target.popularity.value;
    const satisfaction = event.target.satisfaction.value;
    setLoader(true);
    event.preventDefault();
   
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
         
        </div>

        <Modal
          show={show}
          onHide={handleClose}
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
