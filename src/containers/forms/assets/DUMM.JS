import React, {useState, useEffect} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import GetProperty from '../../../utilities/Helpers/getProperty';
import TransactionOptions from "../login/TransactionOptions";
import base64url from "base64url";
// import helper from "../../../utilities/helper";
import {handleUpload} from "../../../utilities/Helpers/pinta";

const MintAsset = (props) => {
    const PropertyHelper = new GetProperty();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState('');
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [fromID, setFromID] = useState('');
    const [testIdentityId, settestIdentityId] = useState('');
    const [typeOption, setTypeOption] = useState('asset');
    const [category, setCategory] = useState('arts');
    const [mutableStyle, setMutableStyle] = useState('Blue');
    const [totalAttributes, setTotalAttributes] = useState(1);
    const [totalPropertiesList, setTotalPropertiesList] = useState(['property #1']);
    const [encodedUrl, setEncodedUrl] = useState('');

    useEffect(() => {
        let fromIDValue = localStorage.getItem('identityId');
        let testIdentityId = localStorage.getItem('identityId');
        setFromID(fromIDValue);
        settestIdentityId(testIdentityId);
    }, []);


    const handleClose = () => {
        setShow(false);
        props.setExternalComponent('');
    };

    const handleChangeType = evt => {
        setTypeOption(evt.target.value);
    };
    const handleChangeStyle = evt => {
        setMutableStyle(evt.target.value);
    };

    const handleProperties =()=>{
        const oldProperties = [...totalPropertiesList];
        oldProperties.push('property #'+(totalAttributes+1));
        setTotalAttributes(totalAttributes+1);
        setTotalPropertiesList(oldProperties);
    };

    const urlChangeHandler = async (e) =>{
        const fileData = e.target.files[0];
        let res = await handleUpload(fileData, fileData.name, true);
        console.log(res.IpfsHash, "IPFS Hash Uploaded File");
        const updateFileUrl="https://demo-assetmantle.mypinata.cloud/ipfs/"+res.IpfsHash+"/"+fileData.name;
        const ImmutableUrlEncode = PropertyHelper.getUrlEncode(updateFileUrl);
        // const ImmutableUrlEncode = await helper.IpfsPath(fileData);
        console.log(ImmutableUrlEncode, "ImmutableUrlEncode");
        setEncodedUrl(ImmutableUrlEncode);
    };
    const handleRemoveProperties =(index)=>{
        if(totalAttributes >1) {
            let newArr = [...totalPropertiesList];
            newArr.splice(index, 1);
            setTotalPropertiesList(newArr);
            setTotalAttributes(totalAttributes - 1);
        }
    };
    const handleFormSubmit = async (event) => {
        setLoader(true);
        event.preventDefault();
        const propertyDataObject = [];

        // ImmutableUrlEncode = PropertyHelper.getUrlEncode(ImmutableUrl);
        // console.log(ImmutableUrlEncode, "ImmutableUrl");
        totalPropertiesList.map((property, idx) => {
            const propertyName = `propertyName`+(idx+1);
            const propertyValue = `propertyValue`+(idx+1);
            const propertyNameData = document.getElementById(propertyName).value;
            const propertyValueData = document.getElementById(propertyValue).value;
            propertyDataObject.push(
                {
                    propertyName:propertyNameData,
                    propertyValue:propertyValueData
                }
            );
        });
        console.log(propertyDataObject, "propertyDataObject");
        const propertyDataObjectHash = PropertyHelper.getUrlEncode(JSON.stringify(propertyDataObject));
        console.log(propertyDataObjectHash, base64url.decode(propertyDataObjectHash), "decode");
        const FromId = event.target.FromId.value;
        let staticMutables = '';
        const name = event.target.name.value;
        const description = event.target.description.value;

        staticMutables = `propertyName:S|${propertyDataObjectHash},type:S|${typeOption}`;

        let staticImmutableMeta = `name:S|${name},description:S|${description},category:S|${category}`;
        let staticImMutables = `style:S|${mutableStyle}`;
        // let ImmutableUrlEncode = '';
        // const ImmutableUrl = event.target.URI.value;
        // ImmutableUrlEncode = await helper.IpfsPath(event.target.DefineURI.files[0]);
        let mutableValues = '';
        let immutableValues = '';
        let mutableMetaValues = '';
        let immutableMetaValues = '';

        mutableValues = `burn:H|,lock:H|`;

        mutableMetaValues = staticMutables;

        immutableValues = `${staticImMutables}`;

        immutableMetaValues =  `URI:S|${encodedUrl},${staticImmutableMeta}`;

        const toID = event.target.toID.value;

        if (mutableValues === '') {
            setErrorMessage(t('SELECT_MUTABLE'));
            setLoader(false);
        } else if (mutableMetaValues === '') {
            setErrorMessage(t('SELECT_MUTABLE_META'));
            setLoader(false);
        }  else {
            let totalData = {
                fromID: FromId,
                toID: toID,
                classificationId: 'test.j0Uuu1ZA7krYEQ036oQVnzmkQVs=',
                mutableValues: mutableValues,
                immutableValues: immutableValues,
                immutableMetaValues: immutableMetaValues,
                mutableMetaValues: mutableMetaValues,
            };
            console.log(totalData);
            setTotalDefineObject(totalData);
            setExternalComponent('Keystore');
            setShow(false);

            setLoader(false);
        }
    };
    const handleChangeCategory = evt => {
        setCategory(evt.target.value);
    };

    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <div>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                </div>
                <Modal.Header closeButton>
                    {t('MINT_ASSET')}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group>
                            <Form.Label>{t('FROM_ID')}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                defaultValue={fromID !== null ? fromID : testIdentityId}
                                placeholder={t('FROM_ID')}
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t('TO_ID')}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="toID"
                                defaultValue={fromID !== null ? fromID : testIdentityId}
                                required={true}
                                placeholder={t('TO_ID')}
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>Burn</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="MutableBurn"
                                value={-1}
                                required={true}
                                placeholder='MutableBurn'
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>MutableLock</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="MutableLock"
                                value={-1}
                                required={true}
                                placeholder='MutableLock'
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.File onChange={urlChangeHandler} id="DefineURI" name="DefineURI" label="Upload Image" required={true} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="category"
                                required={true}
                                onChange={handleChangeCategory}>
                                <option
                                    value="arts">{t('ARTS')}</option>
                                <option value="virtual">{t('VIRTUAL_CARDS')}</option>
                                <option value="3d">{t('3D')}</option>
                                <option value="music">{t('MUSIC')}</option>
                                <option value="collectibles">{t('COLLECTIBLES')}</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="name"
                                required={true}
                                placeholder="Name"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="description"
                                required={true}
                                placeholder="Description"
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>Style</Form.Label>
                            <Form.Control as="select"
                                onChange={handleChangeStyle}
                                name="Style"
                                required={true}>
                                <option value="Blue"> Blue</option>
                                <option value="Red">Red</option>
                                <option value="Green"> Green</option>
                                <option value="Black">Black</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" name="type"
                                required={true}
                                onChange={handleChangeType}>
                                <option
                                    value="identity">{t('IDENTITY')}</option>
                                <option value="asset">{t('ASSET')}</option>
                                <option value="order">{t('ORDER')}</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Attributes</Form.Label>
                            <Button type="button" variant="secondary" size="sm"
                                onClick={handleProperties}
                                className="small button-define">Add
                            </Button>
                            {
                                totalPropertiesList.map((property, idx) => {
                                    return (
                                        <Form.Group key={idx}>
                                            <Form.Label>Property #{idx+1} </Form.Label>
                                            <div className="input-property-group">
                                                <Button type="button" variant="secondary" size="sm"
                                                    onClick={() => handleRemoveProperties(idx)}
                                                    className="small button-define">Remove
                                                </Button>
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    id={`propertyName`+(idx+1)}
                                                    name={`propertyName`+(idx+1)}
                                                    required={false}
                                                    placeholder="Property"
                                                />
                                                <br/>
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    id={`propertyValue`+(idx+1)}
                                                    name={`propertyValue`+(idx+1)}
                                                    required={false}
                                                    placeholder="Value"
                                                />
                                            </div>

                                        </Form.Group>
                                    );
                                })
                            }

                        </Form.Group>

                        {errorMessage !== '' ?
                            <span
                                className="error-response">{errorMessage}</span>
                            : ''
                        }
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t('SUBMIT')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <div>
                {
                    externalComponent === 'Keystore' ?
                        <TransactionOptions
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'assetMint'}
                            setShow={setShow}
                            handleClose={handleClose}
                        /> :
                        null
                }
            </div>
        </div>
    );
};

export default MintAsset;
