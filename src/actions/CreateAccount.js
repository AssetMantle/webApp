import React, {useState} from "react";
import axios from "axios";
import {Modal, Form, Button} from "react-bootstrap";
import {addAccountURL} from "../constants/url"
  const CreateAccount = () =>{  
    const [errorData , setErrorData] = useState("");
    const [errorUsername , setErrorUsername] = useState("");
    const [accountData, setAccountData] = useState({});
    const [name ,setName] = useState('');
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleSubmit = event => {
    setErrorData("");
    const url = addAccountURL();
    event.preventDefault();
    axios.post(url, { name })
    .then((response) => {
      setShow(true);
      setAccountData(response.data.result.keyOutput);
    }).catch((error) =>{ 
      setShow(true);
      setErrorData(error.response.data.error)
    }); 
    event.target.reset();
  }
  const handleChange = event =>{
    setErrorUsername("")
    // const nameRe = /^[a-zA-Z\b]+$/;
    // if (event.target.value === '' || nameRe.test(event.target.value)) {
    setName( event.target.value);
    // }
    // else{
    //   setErrorUsername("Enter Only Alphabets")
    // }
  }

  

    return (
      <div className="container">
      <div className="accountInfo">
            <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
                <div className="col-md-6 custom-pad signup-box">
                <Form onSubmit = { handleSubmit }> 
                <h4 className="formTitle">Create Your Account</h4>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" 
                onChange= {handleChange} required="true" />
                {/* <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text> */}
              </Form.Group>
              <p class="errorText"> {errorUsername}</p>
              <div className="submitButtonSection">
              <Button variant="primary" type="submit">
                Submit
              </Button>
              </div>
            </Form>
                </div>
            </div>
      
        
          <Modal show={show} onHide={handleClose} className="accountInfoModel" centered>
            <Modal.Header>
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
                        <p><b>Name: </b> {`${accountData.name}`}</p>
                        <p><b>Address: </b> {`${accountData.address}`}</p>
                        <p><b>Mnemonic:</b>  {`${accountData.mnemonic}`}</p>
                        <p className="note">Note: Welcome to Persistence!
                          Your account have been created.
                          Please save above details for future use:</p>
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
      </div>
    );
}
export default CreateAccount
