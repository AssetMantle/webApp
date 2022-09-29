import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import GetID from "../../../utilities/Helpers/getID";
import {queryIdentities} from "mantlejs/build/transaction/identity/query";
import Icon from "../../../icons";
import Loader from '../../../components/loader';
import GetMeta from "../../../utilities/Helpers/getMeta";
import config from "../../../config";

const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);

const AddIdentity = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loader, setLoader] = useState(false);
    const [idErrorMessage, setIdErrorMessage] = useState("");
    const {t} = useTranslation();
    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();
    const handleSubmit = async event => {
        event.preventDefault();
        setLoader(true);
        setErrorMessage(false);
        setIdErrorMessage('');
        const IdentityName = event.target.identityname.value;
        const hashGenerate = GetMetaHelper.Hash(GetMetaHelper.Hash(IdentityName));
        const identityID = config.nubClassificationID+'|'+hashGenerate;
        const identities = identitiesQuery.queryIdentityWithID(identityID);
        if (identities) {
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                const hashGenerate = GetMetaHelper.Hash(IdentityName);
                let count = 0;
                if(dataList !== null) {
                    for (let i = 0; i < dataList.length; i++) {
                        if (dataList[i].value.immutables.value.properties.value.propertyList !== null) {
                            const immutablePropertyList = dataList[i].value.immutables.value.properties.value.propertyList[0];
                            if (immutablePropertyList.value.fact.value.hash === hashGenerate) {
                                const identityId = GetIDHelper.GetIdentityID(dataList[i]);
                                if (dataList[i].value.provisionedAddressList) {
                                    let loginAddress = localStorage.getItem("userAddress");
                                    if (!dataList[i].value.provisionedAddressList.includes(loginAddress)) {
                                        let list = [];
                                        const userList = localStorage.getItem("userList");
                                        if (userList !== null) {
                                            list = JSON.parse(userList);
                                        }
                                        if (list.includes(IdentityName)) {
                                            setErrorMessage(false);
                                            setLoader(false);
                                            setIdErrorMessage('identityID already Added');
                                        } else {
                                            setErrorMessage(false);
                                            setLoader(false);
                                            setIdErrorMessage('Login address not found in identity address list');
                                        }
                                        return;
                                    } else {
                                        let list = [];
                                        let idList = [];
                                        const userList = localStorage.getItem("userList");
                                        const identityList = localStorage.getItem("identityList");
                                        if (identityList !== null) {
                                            idList = JSON.parse(identityList);
                                        }
                                        if (userList !== null) {
                                            list = JSON.parse(userList);
                                        }
                                        idList.push({[IdentityName]: identityId});
                                        list.push(IdentityName);
                                        setLoader(false);
                                        localStorage.setItem("userList", JSON.stringify(list));
                                        localStorage.setItem("identityList", JSON.stringify(idList));
                                        localStorage.setItem("identityId", identityId);
                                        localStorage.setItem("userName", IdentityName);
                                        setShow(false);
                                        props.setExternalComponent("");
                                        history.push('/profile');

                                        window.location.reload();
                                        count = 0;
                                        break;
                                    }
                                }

                            } else {
                                count++;
                            }
                        }
                    }
                    if (count !== 0) {
                        setLoader(false);
                        setErrorMessage(true);
                    }
                }else {
                    setLoader(false);
                    setErrorMessage(true);
                }
            });
        }
    };

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };

    const backHandler = (item) => {
        if (item === "identityLogin") {
            setShow(false);
            props.setShow(true);
            props.setExternalComponent("");
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} backdrop="static" className="mnemonic-login-section login-section"
                centered>
                <Modal.Header closeButton>
                    {props.pageName === "LoginAction" ?
                        <div className="back-button" onClick={() => backHandler('identityLogin')}>
                            <Icon viewClass="arrow-icon" icon="arrow"/>
                        </div>
                        : ""}
                    {t('ADD_USER_NAME')}
                </Modal.Header>
                <Modal.Body>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="m-0">
                            <Form.Label>{t('ENTER_USER_NAME')}</Form.Label>
                            <Form.Control type="text" name="identityname"
                                placeholder="Enter UserName"
                                required={true}/>
                        </Form.Group>
                        <div className="error-section"><p className="error-response">
                            {errorMessage ?
                                "UserName not exist"
                                : ""
                            }
                            {idErrorMessage !== "" ?
                                idErrorMessage
                                : ""
                            }
                        </p></div>
                        <div className="submitButtonSection">
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                {t("SUBMIT")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AddIdentity;
