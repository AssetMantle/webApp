import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import config from '../../../constants/config.json';
import FilterHelpers from '../../../utilities/Helpers/filter';
import GetProperty from '../../../utilities/Helpers/getProperty';
import TransactionOptions from "../login/TransactionOptions";


const MutateAsset = (props) => {
    const FilterHelper = new FilterHelpers();
    const PropertyHelper = new GetProperty();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [keyList, setKeyList] = useState([]);
    const [fromID, setFromID] = useState('');
    const [externalComponent, setExternalComponent] = useState('');
    const [totalDefineObject, setTotalDefineObject] = useState({});

    useEffect(() => {
        let fromIDValue = localStorage.getItem('identityId');
        setFromID(fromIDValue);
        const mutateProperties = props.mutatePropertiesList;
        const mutableKeys = Object.keys(mutateProperties);
        setKeyList(mutableKeys);
    }, []);

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent('');
    };

    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const FromId = event.target.FromId.value;
        const assetId = props.asset.ownableID;
        let mutableValues = '';
        let mutableMetaValues = '';
        let mutableProperties = [];
        const propertyData = JSON.parse(props.mutatePropertiesList["propertyName"]);
        Object.keys(propertyData).map((property) => {
            let name = propertyData[property]['propertyName'];
            let mutableFieldValue = document.getElementById(propertyData[property]['propertyValue']).value;
            mutableProperties.push(
                {
                    propertyName: name,
                    propertyValue: mutableFieldValue
                }
            );
        });

        if (keyList !== null) {
            keyList.map((key) => {
                if (key !== "propertyName") {
                    let mutableFieldValue = document.getElementById(key).value;
                    const mutableType = props.asset.mutablePropertyTypes[key];
                    const inputName = (key);
                    if (key !== config.URI) {
                        const mutableMetaValuesResponse = FilterHelper.setTraitValues([], mutableValues, mutableMetaValues, inputName, key, mutableType, mutableFieldValue);
                        if (mutableMetaValuesResponse[0] !== '') {
                            mutableValues = mutableMetaValuesResponse[0];
                        }
                        if (mutableMetaValuesResponse[1] !== '') {
                            mutableMetaValues = mutableMetaValuesResponse[1];
                        }
                    }
                    let uriFieldValue;
                    let uriMutable;
                    if (key === config.URI) {
                        uriFieldValue = PropertyHelper.getUrlEncode(mutableFieldValue);
                        uriMutable = `URI:S|${uriFieldValue}`;
                    }
                    if (uriMutable) {
                        if (mutableMetaValues) {
                            mutableMetaValues = mutableMetaValues + ',' + uriMutable;
                        } else {
                            mutableMetaValues = uriMutable;
                        }
                    }
                }
            },
            );
            const propertyDataObjectHash = PropertyHelper.getUrlEncode(JSON.stringify(mutableProperties));
            if (mutableMetaValues !== "") {
                mutableMetaValues = mutableMetaValues + ',' + `propertyName:S|${propertyDataObjectHash}`;
            } else {
                mutableMetaValues = `propertyName:S|${propertyDataObjectHash}`;
            }

            let totalData = {
                fromID: FromId,
                assetId: assetId,
                mutableValues: mutableValues,
                mutableMetaValues: mutableMetaValues,
            };
            setTotalDefineObject(totalData);
            setExternalComponent('Keystore');
            setShow(false);
            setLoader(false);
        }

    };

    let PropertyObject = [];
    if (props.mutatePropertiesList) {
        const propertyData = JSON.parse(props.mutatePropertiesList["propertyName"]);
        Object.keys(propertyData).map((property, keyprop) => {
            let content =
                <Form.Group key={keyprop}>
                    <Form.Label>{propertyData[property]['propertyName']}</Form.Label>
                    <Form.Control
                        type="text"
                        className=""
                        required={true}
                        id={propertyData[property]['propertyValue']}
                        name={propertyData[property]['propertyValue']}
                        defaultValue={propertyData[property]['propertyValue']}
                    />
                </Form.Group>;
            PropertyObject.push(content);
        });
    }
    return (
        <div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t('MUTATE_ASSET')}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t('FROM_ID')}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                defaultValue={fromID !== null ? fromID : ''}
                                placeholder="FromId"
                            />
                        </Form.Group>
                        {props.mutatePropertiesList ?
                            Object.keys(props.mutatePropertiesList).map((keyName, idx) => {
                                console.log(idx, "idx");
                                if (keyName !== "propertyName" && keyName !== "lock" && keyName !== "burn") {
                                    return (
                                        <div key={idx}>
                                            <Form.Group>
                                                <Form.Label>{keyName}*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    required={true}
                                                    id={keyName}
                                                    name={keyName}
                                                    defaultValue={props.mutatePropertiesList[keyName]}
                                                />
                                            </Form.Group>
                                        </div>
                                    );
                                }
                            })
                            : ""

                        }
                        {PropertyObject}
                        {/*{errorMessage !== '' ?*/}
                        {/*    <span*/}
                        {/*        className="error-response">{errorMessage}</span>*/}
                        {/*    : ''*/}

                        {/*}*/}
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t('submit')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {
                externalComponent === 'Keystore' ?
                    <TransactionOptions
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={totalDefineObject}
                        TransactionName={'mutate Asset'}
                        setShow={setShow}
                        handleClose={handleClose}
                    /> :
                    null
            }
        </div>
    );
};

export default MutateAsset;
