import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import { useHistory } from "react-router-dom";
const Login = () => {  
    const history = useHistory();
    const [errorData , setErrorData] = useState("")
    // const [recoverData, setRecoverData] = useState('');
    const [userType , setUserType] = useState('EndUser');
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
  
    const handleSubmit = event => {
      // const userName = event.target.name.value;
      localStorage.setItem('userType', userType);
      setErrorData("");
      history.push('/')
      // axios.post(url, userInput)
      // .then((response) => {
      //   setShow(true);
      
      //   localStorage.setItem('address', response.data.result.keyOutput.address)
      //   localStorage.setItem('userName', userName);
      //   localStorage.setItem('userType', userType);
      //   history.push('/')
      // }).catch((error) =>{ 
      //   setShow(true);
      //   setErrorData(error.response.data.error)
      // });
      event.target.reset();
    }
    // const [userInput, setUserInput] = useReducer(
    //   (state, newState) => ({...state, ...newState}),
    //   {
    //     name: '',
    //     mnemonic: '',
    //   }
    // );
    // const handleChange = evt =>{
    //   const name = evt.target.name;
    //   const newValue = evt.target.value;
    //   setUserInput({[name]: newValue});
    // }
    const handleUserTypeChange = evt =>{
        setUserType(evt.target.value);
      }

    return (
      <div className="container">
      <div className="accountInfo">
            <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
                <div className="col-md-6 custom-pad signup-box">
                <Form onSubmit = { handleSubmit }> 
                <h4 className="formTitle">Login</h4>
                {/* <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" name="name" onChange= {handleChange} required="true"/>
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Mnemonic</Form.Label>
                    <Form.Control type="text" placeholder="Enter Mnemonic" name="mnemonic" onChange= {handleChange} required="true" />
                  </Form.Group> */}
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Login as</Form.Label>
                <Form.Control as="select" value={userType} onChange= {handleUserTypeChange}>
                <option value="Maintainer">Maintainer</option>
                <option value="EndUser">EndUser</option>
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
export default Login
