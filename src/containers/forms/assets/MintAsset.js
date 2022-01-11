import React, {useEffect, useState} from 'react';
import {Button, Form, OverlayTrigger, Popover} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import GetProperty from '../../../utilities/Helpers/getProperty';
import TransactionOptions from "../login/TransactionOptions";
import {handleUpload} from "../../../utilities/Helpers/pinata";
import Loader from "../../../components/loader";
import Icon from "../../../icons";
import logo from "../../../assets/images/logo.svg";
import loaderImage from "../../../assets/images/loader.svg";
import helper from "../../../utilities/helper";
import config from "../../../config";

import "@google/model-viewer/dist/model-viewer";

const MintAsset = () => {
    const PropertyHelper = new GetProperty();
    const {t} = useTranslation();
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
    const [exampleState, setExampleState] = useState(
        {
            mint_asset: {
                img_url: 'radd',
                asset_category: '',
                asset_name: '',
                asset_description: '',
            }
        });

    useEffect(() => {
        let fromIDValue = localStorage.getItem('identityId');
        let testIdentityId = localStorage.getItem('identityId');
        setFromID(fromIDValue);
        settestIdentityId(testIdentityId);


    }, []);

    const handleClose = () => {
        setExternalComponent('');
    };

    const handleChangeType = evt => {
        setTypeOption(evt.target.value);
    };


    const handleChangeStyle = evt => {
        setMutableStyle(evt.target.value);
    };

    const handleProperties = () => {
        const oldProperties = [...totalPropertiesList];
        oldProperties.push('property #' + (totalAttributes + 1));
        setTotalAttributes(totalAttributes + 1);
        setTotalPropertiesList(oldProperties);
    };

    const urlChangeHandler = async (e) => {
        const fileData = e.target.files[0];
        setErrorMessage("");
        if(helper.imageTypeCheck(fileData.name)) {
            setUrlLoader(true);
            setFileName(fileData.name);
            let res = await handleUpload(fileData, fileData.name, true);
            const updateFileUrl = "https://demo-assetmantle.mypinata.cloud/ipfs/" + res.IpfsHash + "/" + fileData.name;
            setFileUrl(updateFileUrl);
            // const ipfsPath = await helper.pinataFile(fileData, res.IpfsHash);
            // console.log(ipfsPath, "ipfspath", updateFileUrl);
            const ImmutableUrlEncode = PropertyHelper.getUrlEncode(updateFileUrl);
            setEncodedUrl(ImmutableUrlEncode);
            const imageExtension = fileData.name.substring(fileData.name.lastIndexOf('.') + 1);
            setImageExtension(imageExtension);
            setUrlLoader(false);
        }else{
            setErrorMessage("Unsupported image type");
        }
    };
    const handleRemoveProperties = (index) => {
        if (totalAttributes > 1) {
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
            const propertyName = `propertyName` + (idx + 1);
            const propertyValue = `propertyValue` + (idx + 1);
            const propertyNameData = document.getElementById(propertyName).value;
            const propertyValueData = document.getElementById(propertyValue).value;
            propertyDataObject.push(
                {
                    propertyName: propertyNameData,
                    propertyValue: propertyValueData
                }
            );
        });
        const propertyDataObjectHash = PropertyHelper.getUrlEncode(JSON.stringify(propertyDataObject));
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

        mutableValues = `burn:H|1,lock:H|1`;

        mutableMetaValues = staticMutables;

        immutableValues = `${staticImMutables}`;

        immutableMetaValues = `URI:S|${encodedUrl},${staticImmutableMeta}`;

        const toID = event.target.toID.value;

        if (mutableValues === '') {
            setErrorMessage(t('SELECT_MUTABLE'));
            setLoader(false);
        } else if (mutableMetaValues === '') {
            setErrorMessage(t('SELECT_MUTABLE_META'));
            setLoader(false);
        } else {
            let totalData = {
                fromID: FromId,
                toID: toID,
                classificationId: config.assetClassificationID,
                mutableValues: mutableValues,
                immutableValues: immutableValues,
                immutableMetaValues: immutableMetaValues,
                mutableMetaValues: mutableMetaValues,
            };
            setTotalDefineObject(totalData);
            setExternalComponent('Keystore');
            setLoader(false);
        }
    };
    const handleChangeCategory = evt => {
        setCategory(evt.target.value);
    };
    const nameChangeHandler = evt => {
        const newObject = exampleState;
        newObject.mint_asset.asset_name = evt.target.value;
        localStorage.setItem("mint_asset", JSON.stringify(newObject));
        setExampleState(newObject);
        setInitialName(evt.target.value);
    };

    const categoryChangeHandler = evt => {
        const newObject = exampleState;
        newObject.mint_asset.asset_category = evt.target.value;
        localStorage.setItem("mint_asset", JSON.stringify(newObject));
        setExampleState(newObject);
        setInitialCategory(evt.target.value);
    };

    const handleDescriptionChange = (evt) => {
        const newObject = exampleState;
        newObject.mint_asset.asset_description = evt.target.value;
        localStorage.setItem("mint_asset", JSON.stringify(newObject));
        setExampleState(newObject);
    };

    const fileInputLabel = (<div className="text-center">
        <Icon viewClass="icon-upload" icon="upload"/>
        <p>{fileName}</p>
    </div>);
    const popoverTotal = (
        <Popover id="popover-total">
            <Popover.Content>
                {t('IMAGE_UPLOAD_WARNING')}
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
                    <h1 className="page-title">{t('CREATE_NEW_ITEM')}</h1>
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
                            <Form.Label>{t('BURN')}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="MutableBurn"
                                defaultValue={-1}
                                required={true}
                                placeholder='MutableBurn'
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t('MUTABLE_LOCK')}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="MutableLock"
                                defaultValue={-1}
                                required={true}
                                placeholder='MutableLock'
                            />
                        </Form.Group>
                        <div className="custom-file-upload-box">
                            <Form.Label>{t('IMAGE')}
                                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                    overlay={popoverTotal}>
                                    <button className="icon-button info" type="button"><Icon
                                        viewClass="arrow-right"
                                        icon="info"/></button>
                                </OverlayTrigger></Form.Label>
                            <Form.Text className="text-muted">
                                {t('IMAGE_UPLOAD_INFO')}
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
                            <Form.Label>{t('CATEGORY')}</Form.Label>
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
                            <Form.Label>{t('NAME')}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="name"
                                onKeyPress={helper.stringValidation}
                                onBlur={nameChangeHandler}
                                required={true}
                                placeholder="Name"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('DESCRIPTION')}</Form.Label>
                            <Form.Control as="textarea" rows={3}
                                name="description"
                                placeholder="Enter Description"
                                id="Description"
                                required={true}
                                onChange={handleDescriptionChange}/>

                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t('STYLE')}</Form.Label>
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
                            <Form.Label>{t('TYPE')}</Form.Label>
                            <Form.Control as="select" name="type"
                                required={true}
                                onChange={handleChangeType}>
                                <option
                                    value="identity">{t('IDENTITY')}</option>
                                <option value="asset">{t('ASSET')}</option>
                                <option value="order">{t('ORDER')}</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="attributes-container m-0">
                            <Form.Label>{t('ATTRIBUTES')}</Form.Label>
                            <Button type="button" variant="secondary" size="sm"
                                onClick={handleProperties}
                                className="small button-define"><Icon viewClass="icon-upload" icon="plus"/>
                            </Button>
                            {
                                totalPropertiesList.map((property, idx) => {
                                    return (
                                        <Form.Group key={idx}>
                                            <Form.Label>Property #{idx + 1} </Form.Label>
                                            <div className="input-property-group">
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    id={`propertyName` + (idx + 1)}
                                                    name={`propertyName` + (idx + 1)}
                                                    required={false}
                                                    onKeyPress={helper.stringValidation}
                                                    placeholder="Property"
                                                />
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    id={`propertyValue` + (idx + 1)}
                                                    name={`propertyValue` + (idx + 1)}
                                                    onKeyPress={helper.stringValidation}
                                                    required={false}
                                                    placeholder="Value"
                                                />
                                                <Button type="button" variant="secondary" size="sm"
                                                    onClick={() => handleRemoveProperties(idx)}
                                                    className="small button-define"><Icon viewClass="icon-upload"
                                                        icon="delete"/>
                                                </Button>
                                            </div>

                                        </Form.Group>
                                    );
                                })
                            }

                        </Form.Group>
                        <div className="error-section">
                            <p className="error-response">
                                {errorMessage !== "" ?
                                    errorMessage
                                    : ""
                                }
                            </p>
                        </div>
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit" disabled={urlLoader}>
                                {t('SUBMIT')}
                            </Button>
                        </div>
                    </Form>
                </div>

                <div className="right-content">
                    <p className="text-center title">{t('PREVIEW_NFT')}</p>
                    <div className="preview-container">
                        <div className="image">
                            {!urlLoader ?
                                imageExtension === "glb" ?
                                    <div className="image-container">

                                        <model-viewer
                                            src={fileUrl}
                                            camera-controls auto-rotate/>
                                    </div>
                                    :
                                    imageExtension === "mp4" ?
                                        <video className="banner-video" autoPlay playsInline preload="metadata" loop="loop"
                                            controls muted src={fileUrl}>
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
                            <p>{initialName}</p>
                            <p>{initialCategory}</p>
                        </div>
                    </div>
                </div>
                {
                    externalComponent === 'Keystore' ?
                        <TransactionOptions
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'assetMint'}
                            handleClose={handleClose}
                        /> :
                        null
                }

            </div>
        </div>
    );
};

export default MintAsset;
