import React, {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import GetProperty from '../../../utilities/Helpers/getProperty';
import TransactionOptions from "../login/TransactionOptions";
import base64url from "base64url";
// import helper from "../../../utilities/helper";
import {handleUpload} from "../../../utilities/Helpers/pinta";
import Loader from "../../../components/loader";
import Icon from "../../../icons";
import logo from "../../../assets/images/logo.svg";
import loaderImage from "../../../assets/images/loader.svg";
import {OverlayTrigger, Popover} from "react-bootstrap";
const MintAsset = (props) => {
    const PropertyHelper = new GetProperty();
    const {t} = useTranslation();
    // const [show, setShow] = useState(true);
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
    const [fileName, setFileName] = useState('No file chosen');
    const [fileUrl, setFileUrl] = useState(logo);
    const [urlLoader, setUrlLoader] = useState(false);
    const [initialName, setInitialName] = useState('Name');
    const [initialCategory, setInitialCategory] = useState('Category');
    const [imageExtension, setImageExtension] = useState('png');

    useEffect(() => {
        let fromIDValue = localStorage.getItem('identityId');
        let testIdentityId = localStorage.getItem('identityId');
        setFromID(fromIDValue);
        settestIdentityId(testIdentityId);
    }, []);


    const handleClose = () => {
        // setShow(false);
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
        setUrlLoader(true);
        const fileData = e.target.files[0];
        setFileName(fileData.name);
        console.log(fileData, "fileData");
        let res = await handleUpload(fileData, fileData.name, true);
        console.log(res, "IPFS Hash Uploaded File");
        const updateFileUrl="https://demo-assetmantle.mypinata.cloud/ipfs/"+res.IpfsHash+"/"+fileData.name;
        console.log(updateFileUrl, "updateFileUrl");

        setFileUrl(updateFileUrl);
        const ImmutableUrlEncode = PropertyHelper.getUrlEncode(updateFileUrl);
        const imageExtension = fileData.name.substring(fileData.name.lastIndexOf('.') + 1);
        console.log(imageExtension, "image");
        setImageExtension(imageExtension);
        setEncodedUrl(ImmutableUrlEncode);
        setUrlLoader(false);
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

        totalPropertiesList.map((property, idx) => {
            const propertyName = `propertyName`+(idx+1);
            const propertyValue = `propertyValue`+(idx+1);
            const propertyNameData =  document.getElementById(propertyName).value;
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
        const name = PropertyHelper.getUrlEncode(event.target.name.value);
        const description = PropertyHelper.getUrlEncode(event.target.description.value);

        staticMutables = `propertyName:S|${propertyDataObjectHash},type:S|${typeOption}`;

        let staticImmutableMeta = `name:S|${name},description:S|${description},category:S|${PropertyHelper.getUrlEncode(category)}`;
        let staticImMutables = `style:S|${mutableStyle}`;

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
            // setShow(false);

            setLoader(false);
        }
    };
    const handleChangeCategory = evt => {
        setCategory(evt.target.value);
    };
    const nameChangeHandler = evt =>{

        setInitialName(evt.target.value);
    };

    const categoryChangeHandler = evt =>{
        setInitialCategory(evt.target.value);
    };

    const fileInputLabel = (<div className="text-center">
        <Icon viewClass="icon-upload" icon="upload"/>
        <p>{fileName}</p>
    </div>);
    const popoverTotal = (
        <Popover id="popover-total">
            <Popover.Content>
                Please make sure you upload images / artwork that you have created or have the right to use.
            </Popover.Content>
        </Popover>
    );
    return (
        <div className="page-body">
            <div className="container mint-page-body">
                <div>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                </div>
                <div className="left-content">
                    <h1 className="page-title">Create new item</h1>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="hidden">
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
                        <div className="custom-file-upload-box">
                            <Form.Label>Image
                                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                    overlay={popoverTotal}>
                                    <button className="icon-button info" type="button"><Icon
                                        viewClass="arrow-right"
                                        icon="info"/></button>
                                </OverlayTrigger></Form.Label>
                            <Form.Text className="text-muted">
                           File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3. Max size: 100 MB
                            </Form.Text>
                            <Form.Group className="custom-file-upload">
                                <Form.File
                                    onChange={urlChangeHandler}
                                    id="DefineURI"
                                    name="DefineURI"
                                    label={fileInputLabel}
                                    required={true}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="category"
                                required={true}
                                onBlur={categoryChangeHandler}
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
                                onBlur={nameChangeHandler}
                                required={true}
                                placeholder="Name"
                            />
                        </Form.Group>
                    
                    
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={5}
                                name="description"
                                placeholder="Enter Description"
                                id="Description"
                                required={true}/>

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

                        <Form.Group className="attributes-container">
                            <Form.Label>Attributes</Form.Label>
                            <Button type="button" variant="secondary" size="sm"
                                onClick={handleProperties}
                                className="small button-define"><Icon viewClass="icon-upload" icon="plus"/>
                            </Button>
                            {
                                totalPropertiesList.map((property, idx) => {
                                    return (
                                        <Form.Group key={idx}>
                                            <Form.Label>Property #{idx+1} </Form.Label>
                                            <div className="input-property-group">
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    id={`propertyName`+(idx+1)}
                                                    name={`propertyName`+(idx+1)}
                                                    required={false}
                                                    placeholder="Property"
                                                />
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    id={`propertyValue`+(idx+1)}
                                                    name={`propertyValue`+(idx+1)}
                                                    required={false}
                                                    placeholder="Value"
                                                />
                                                <Button type="button" variant="secondary" size="sm"
                                                    onClick={() => handleRemoveProperties(idx)}
                                                    className="small button-define"><Icon viewClass="icon-upload" icon="delete"/>
                                                </Button>
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
                </div>

                <div className="right-content">
                    <p className="text-center title">Preview NFT</p>
                    <div className="preview-container">
                        <div className="image">
                            {!urlLoader ?
                                imageExtension === "mp4" ?
                                    <video className="banner-video" autoPlay playsinline preload="metadata" loop="loop" controls muted src={fileUrl}>
                                        <source type="video/webm" src={fileUrl}/>
                                        <source type="video/mp4" src={fileUrl}/>
                                        <source type="video/ogg" src={fileUrl}/>
                                    </video>
                                    :
                                    <img src={fileUrl} alt="img-logo"/>
                                :
                                <img src={loaderImage} alt="img-logo" className="loader-url"/>
                            }
                        </div>
                        <div className="preview-content">
                            <p>#{initialName}</p>
                            <p>#{initialCategory}</p>
                        </div>
                    </div>
                </div>
                {
                    externalComponent === 'Keystore' ?
                        <TransactionOptions
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'assetMint'}
                            // setShow={setShow}
                            handleClose={handleClose}
                        /> :
                        null
                }
            
            </div>
        </div>
    );
};

export default MintAsset;
