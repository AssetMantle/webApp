import React, {useState} from "react";
import axios from "axios";
import {buyAssetIdentitiesURL, classificationsURL,assetsURL, buyAssetHashURL, assetMintURL} from "../../constants/url"
import loader from '../../assets/images/loader.svg'
import {Modal, Form, Button} from "react-bootstrap";

const AssetMint = () => {
  const [show, setShow] = useState(false);
  const [errorData , setErrorData] = useState("");
  const [responseData , setResponseData] = useState("");
  const [loading ,setLoader] = useState(false);

  const handleClose = () =>
    {
      setShow(false);
      window.location.reload();
    } 
  const handleSubmit = event => {
    setLoader(true);
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const popularity = event.target.popularity.value;
    const satisfaction = event.target.satisfaction.value;
    const fetchAssetUrl = assetsURL();
    axios.get(fetchAssetUrl).then(
      (assetResponse)=>{
        const assetList = assetResponse.data.result.value.assets.value.list;  
       var promises = [];
       if(assetList !== null){
        assetList.map(function(asset) {
          var count=0;
          if(asset.value.immutables.value.properties.value.propertyList[0].value.id.value.idString === "Name"){
           const hash = asset.value.immutables.value.properties.value.propertyList[0].value.fact.value.hash;
           const hashurl = buyAssetHashURL(hash);
           const counts = axios.get(hashurl).then(
            (hashresponse)=>{
              const listname2 = hashresponse.data.result.value.metas.value.list[0].value.data.value.value;
              if(listname2 === name){
                count++;
              }
              return count;
            })
            promises.push(counts);
          }
          return count;
        })
      }
        Promise.all(promises).then((values) => {
          var sum = values.reduce(function(a, b){
            return a + b;
          }, 0);
        
          if(sum === 0){
            
            const fetchIdentitiesUrl = buyAssetIdentitiesURL();
            axios.get(fetchIdentitiesUrl).then(
              (identitiesResponse)=>{
                const identitiesList = identitiesResponse.data.result.value.identities.value.list;
                var fromIdData="";
                identitiesList.forEach((identity) => {
                  if (identity.value.immutables.value.properties.value.propertyList[0].value.id.value.idString === "Organization") {
                  const hash = identity.value.immutables.value.properties.value.propertyList[2].value.fact.value.hash;
                  const hashurl = buyAssetHashURL(hash);
                  axios.get(hashurl).then(
                   (hashresponse)=>{
                     const hashValue = hashresponse.data.result.value.metas.value.list[0].value.data.value.value;
                     if(hashValue === "John"){
                      const clasificationID = identity.value.id.value.classificationID.value.idString;
                      const hashID = identity.value.id.value.hashID.value.idString;
                      fromIdData = clasificationID + '|' + hashID;
                      const classificationUrl = classificationsURL();
                      axios.get(classificationUrl).then(
                        (clasificationResponse)=>{
                          const clasificationResponseList = clasificationResponse.data.result.value.classifications.value.list;
                          clasificationResponseList.forEach((clasificationItem) => {
                            var classificationIdData="";
                            if ((clasificationItem.value.immutableTraits.value.properties.value.propertyList[0].value.id.value.idString === "Name") && (clasificationItem.value.immutableTraits.value.properties.value.propertyList[1].value.id.value.idString === "Des")){
                             const classificationchainID = clasificationItem.value.id.value.chainID.value.idString
                             const classificationhashID = clasificationItem.value.id.value.hashID.value.idString
                             classificationIdData = classificationchainID + '.' + classificationhashID;
                           
                            const formData = {
                              type:"/xprt/assets/mint/request",
                              value:{
                              baseReq:{
                                from:"cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c",
                                chain_id:"test"
                             },
                             fromID:fromIdData,
                             toID:fromIdData,
                             classificationID:classificationIdData,
                             immutableMetaProperties:`Name:S|${name}`,
                             immutableProperties:`Des:S|${description}`,
                             mutableMetaProperties:`CustSatisfaction:S|${satisfaction},burn:H|1`,
                             mutableProperties:`Popularity:S|${popularity}`,
                            }
                          }
                          console.log(formData)
                           const assetMintPostUrl = assetMintURL();
                            axios.post(assetMintPostUrl, formData)
                            .then((response) => {
                              setLoader(false);
                              setShow(true);
                              setResponseData(response.data.txhash)
                              
                            }).catch((error) =>{ 
                              setLoader(false);
                              setShow(true);
                              setErrorData(error.response
                                ? error.response.data.error.message
                                : error.message)
                            });
                            }
                          })
                        })
                     }
                   })

                  }
                })
            
              })
          }
          else{
            alert("Asset name already exists. Please try with different name")
            setLoader(false);
          }
        });
       
      })
      event.target.reset();
  }

  return (
    <div className="container">
    {
      loading ?
      <div className="loader">
        <img src={loader} alt="loader" />
        </div>
      :
      ""
    }
  <div className="accountInfo">
        <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
            <div className="col-md-6 custom-pad signup-box">
            <Form onSubmit = { handleSubmit }> 
            <h4 className="formTitle">Asset Mint</h4>
            <Form.Group controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Name" 
            name="name"
            required="true"
            />
            <Form.Text className="text-muted">
            add a unique name like "Table", "CPU".
            </Form.Text>
             <Form.Label>Description</Form.Label>
            <Form.Control type="text" 
            name="description"
            placeholder="Enter Description" 
            required="true"
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Popularity</Form.Label>
                <Form.Control as="select" name="popularity" >
                <option value="alwaysPopular">Always Popular</option>
                <option value="Very">Very</option>
                <option value="NotMuch">Not much</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Customer Satisfaction</Form.Label>
                <Form.Control as="select" name="satisfaction" >
                <option value="Good">Good</option>
                <option value="Happy">Happy</option>
                <option value="NotSatisfied">NotSatisfied</option>
                </Form.Control>
            </Form.Group>
          <div className="submitButtonSection">
          <Button variant="primary" type="submit" >
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
                    <p>Order Successful.</p>
                    <p className="modal-tx-hash">tx Hash:{responseData}</p>
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
          <Button variant="primary" onClick={handleClose} >
            ok
          </Button>
        </Modal.Footer>
      </Modal>
  </div>
  </div>
  );
}

export default AssetMint;
