import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import GetID from "../../../utilities/Helpers/getID";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import Icon from "../../../icons";
import Loader from '../../../components/loader';
import GetMeta from "../../../utilities/Helpers/getMeta";
import TransactionOptions from "./TransactionOptions";

const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);

const IdentityLogin = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loader, setLoader] = useState(false);
    const [idErrorMessage, setIdErrorMessage] = useState("");
    const [externalComponent, setExternalComponent] = useState("");
    const [userData, setUserData] = useState({});
    const {t} = useTranslation();
    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();

    const handleSubmit = async event => {
        setLoader(true);
        localStorage.clear();
        event.preventDefault();
        setErrorMessage(false);
        setIdErrorMessage('');
        const IdentityName = event.target.userName.value;
        const identities = identitiesQuery.queryIdentityWithID("all");
        if (identities) {
            identities.then(async function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                const hashGenerate = GetMetaHelper.Hash(IdentityName);
                let count = 0;
                for (var i = 0; i < dataList.length; i++) {

                    if (dataList[i].value.immutables.value.properties.value.propertyList !== null) {
                        const immutablePropertyList = dataList[i].value.immutables.value.properties.value.propertyList[0];

                        if (immutablePropertyList.value.fact.value.hash === hashGenerate) {
                            const identityId = GetIDHelper.GetIdentityID(dataList[i]);

                            if (dataList[i].value.provisionedAddressList) {

                                let addresses = dataList[i].value.provisionedAddressList;
                                const userData = {
                                    'userName': IdentityName,
                                    'identityId': identityId
                                };
                                setUserData(userData);
                                localStorage.setItem('addresses', JSON.stringify(addresses));
                                setShow(false);
                                setExternalComponent("loginOptions");
                            }
                            setLoader(false);
                            count = 0;
                            break;
                        } else {
                            count++;
                        }
                    }
                }
                if (count !== 0) {
                    setLoader(false);
                    setErrorMessage(true);
                }
            }).catch(err => {
                console.log(err, "in login");
                setLoader(false);
            });
        }
    };


    const handleClose = () => {
        setShow(false);
        history.push('/');
    };
    const backHandler = (item) => {
        if (item === "identityLogin") {
            setShow(false);
            props.setShow(true);
            props.setExternalComponent("");
        }
    };

    const handleChangeUserName = (evt) =>{
        setErrorMessage(false);
        setIdErrorMessage("");
        if(evt.target.value.length > 30){
            evt.preventDefault();
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section" centered>
                <Modal.Header closeButton>
                    {props.pageName === "LoginAction" ?
                        <div className="back-button" onClick={() => backHandler('identityLogin')}>
                            <Icon viewClass="arrow-icon" icon="arrow"/>
                        </div>
                        : ""}
                    {t("LOGIN_FORM")}
                </Modal.Header>
                <Modal.Body>
                    {loader ?
                        <Loader/>
                        : ''
                    }

                    <>
                        <div className="mrt-10">
                            <div className="button-view">
                                <div className="icon-section">
                                    <div className="icon-box">
                                        <Icon viewClass="username-icon" icon="username"/>
                                    </div>
                                    {t("USER_NAME")}</div>
                                <Icon viewClass="arrow-icon" icon="arrow"/>
                            </div>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Control type="text" name="userName"
                                placeholder={t("ENTER_USER_NAME")}
                                onKeyPress={handleChangeUserName}
                                required={true}/>
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
                                    {t("LOGIN")}
                                </Button>
                            </div>
                        </Form>
                    </>

                </Modal.Body>
            </Modal>
            {
                externalComponent === 'loginOptions' ?
                    <TransactionOptions
                        setExternalComponent={setExternalComponent}
                        userData={userData}
                        setShow={setShow}
                        TransactionName={'login'}
                    /> :
                    null
            }
        </div>
    );
};

IdentityLogin.displayName = 'IdentityLogin';
export default IdentityLogin;
