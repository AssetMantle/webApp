import React, { useState, useEffect } from "react";
import Identities from "persistencejs/transaction/identity/nub";
import InputField from '../../components/inputField'
import { Form, Button, Modal } from "react-bootstrap";

const Nub = () => {
  const [show, setShow] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [errorData, setErrorData] = useState("");
  const [assetItemsList, setAssetItemsList] = useState([]);
  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const nubId = event.target.nubID.value;
    const userTypeToken = localStorage.getItem('mnemonic');
    const userAddress = localStorage.getItem('address');
    const nubResponse = Identities.nub(userAddress, "test", userTypeToken, "", nubId, 25, "stake", 200000, "block");
    console.log(nubResponse, "nub response")
  };

  return (
    <div className="accountInfo">
   
          <Modal.Header>
            Nub
          </Modal.Header>
          <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <InputField 
            className=""
            name="nubID"
            required="true"
            placeholder="nubID"
            label="nubID"
            />
            <div className="submitButtonSection">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
          </Modal.Body>
      </div>
  );
};

export default Nub;
