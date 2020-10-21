import React, {useState, useReducer} from "react";
import axios from "axios";
import {Modal, Form, Button} from "react-bootstrap";
import {addAccountURL} from "../constants/url"

  const AccountRecover = () =>{  
  const [errorData , setErrorData] = useState("")
  const [recoverData, setRecoverData] = useState({});
  // const [mnemonic , setMnemonic] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleFormSubmit = event => {
    setErrorData("");
    setRecoverData("");
    const url = addAccountURL();
    event.preventDefault();
    axios.post(url, userInput)
    .then((response) => {
      setShow(true);
      setRecoverData(response.data.result.keyOutput)
    }).catch((error) =>{ 
      setShow(true);
      setErrorData(error.response.data.error)
    });
    event.target.reset();
  }
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      name: '',
      mnemonic: '',
    }
  );
  const handleChange = evt =>{
    const name = evt.target.name;
    const newValue = evt.target.value;
    setUserInput({[name]: newValue});
  }

    return (
      <div className="container">
          <div className="accountInfo">
            <div className="row row-cols-1 row-cols-md-2 card-deck recoverySection">
                <div className="col-md-6 custom-pad signup-box">
                <Form onSubmit = { handleFormSubmit }> 
                <h4 className="formTitle">Recover Your Account</h4>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" name="name" onChange= {handleChange} required="true"/>
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Mnemonic</Form.Label>
                    <Form.Control type="text" placeholder="Enter Mnemonic" name="mnemonic" onChange= {handleChange} required="true" />
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

          <Modal show={show} onHide={handleClose} className="accountInfoModel" centered>
            <Modal.Header >
            { !errorData ?
           
              <div className="icon success-icon">
                  <i className="mdi mdi-check"></i>
              </div>
            :
            <div className="icon failure-icon">
                  <i class="mdi mdi-close"></i>
              </div>
              }
            </Modal.Header>
            <Modal.Body>   
            { !errorData ?
            <div>
              <div className="content">
                       
                        <p className="note">Note: Welcome back to Persistence!
                          Your account have been recovered.
                          Please save below details for future use:
                          </p>
                          <p><b>Name: </b> {`${recoverData.name}`}</p>
                          <p><b>Address: </b> {`${recoverData.address}`}</p>
                          <p><b>Mnemonic:</b>  {`${recoverData.mnemonic}`}</p>
                </div>
                </div>
                  :
                  <div className="error-box">
                  <div className="content">
                  <p>{errorData}</p>
                  </div>
              </div>
              }
         
              </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                ok
              </Button>
            </Modal.Footer>
          </Modal>
  
      </div>
    );
}
export default AccountRecover



