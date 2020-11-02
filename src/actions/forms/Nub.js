import React, { useState, useEffect } from "react";
import axios from "axios";
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
   
  };

  return (
    <div className="accountInfo">
   
          <Modal.Header>
            <p>nub</p>
          </Modal.Header>
          <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <h4 className="formTitle">Mutate Asset</h4>
            <InputField 
            className=""
            name="nubID"
            required="true"
            placeholder="nubID"
            label="nubID"
            />
            <InputField 
            className=""
            name="feesAmount"
            required="true"
            placeholder="feesAmount"
            label="feesAmount"
            />
            <InputField 
            className=""
            name="feesToken"
            required="true"
            placeholder="feesToken"
            label="feesToken"
            />
            <InputField 
            className=""
            name="gas"
            required="true"
            placeholder="gas"
            label="gas"
            />
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              ok
            </Button>
          </Modal.Footer>
      </div>
  );
};

export default Nub;
