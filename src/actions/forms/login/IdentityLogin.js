import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import GetID from "../../../utilities/Helpers/getID";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import MnemonicIcon from "../../../assets/images/MnemonicIcon.svg";
import Icon from "../../../icons";
import Loader from '../../../components/loader';
import GetMeta from "../../../utilities/Helpers/getMeta";
import transactions from "../../../utilities/Helpers/transactions";
import {getWallet} from "persistencejs/build/utilities/keys";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);

const IdentityLogin = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loader, setLoader] = useState(false);
    const [idErrorMessage, setIdErrorMessage] = useState("");
    const [loginForm, setLoginForm] = useState(true);
    const [userName, setUserName] = useState("");
    const {t} = useTranslation();
    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();



    // const getIdentityId = async (userIdHash, dataList) => {
    //     let count = 0;
    //     dataList.forEach(function (identity) {
    //         if (identity.value.immutables.value.properties.value.propertyList !== null) {
    //             const immutablePropertyList = identity.value.immutables.value.properties.value.propertyList[0];
    //             console.log(immutablePropertyList.value.fact.value.hash , userIdHash, "immutablePropertyList.value.fact.value.hash === userIdHash");
    //             if (immutablePropertyList.value.fact.value.hash === userIdHash) {
    //                 return GetIDHelper.GetIdentityID(identity);
    //                 count = 0;
    //                 break;
    //             } else {
    //                 count ++;
    //             }
    //         }
    //     });
    // };


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
                            setUserName(IdentityName);
                            const identityId = GetIDHelper.GetIdentityID(dataList[i]);
                            localStorage.setItem("identityId", identityId);
                            console.log(identityId, "identityId");
                            if(dataList[i].value.provisionedAddressList){
                                let addresses = dataList[i].value.provisionedAddressList;
                                console.log("response finale", dataList[i].value.provisionedAddressList);
                                localStorage.setItem('addresses', JSON.stringify(addresses));
                            }
                            setLoginForm(false);
                            setLoader(false);
                            count = 0;
                            break;
                        } else {
                            count ++;
                        }
                    }
                }
                if(count !== 0){
                    setLoginForm(false);
                    setLoader(false);
                    setErrorMessage(true);
                }
            }).catch(err => {
                console.log(err, "in login");
                setLoader(false);
            });
        }
    };

    const keyStoreSubmitHandler = async (e) =>{
        e.preventDefault();
        const password = e.target.password.value;
        let promise = transactions.PrivateKeyReader(e.target.uploadFile.files[0], password);
        let userMnemonic;
        await promise.then(function (result) {
            userMnemonic = result;
        }).catch(err => {
            setLoader(false);
            setErrorMessage(err);
        });
        const wallet = await getWallet(userMnemonic, "");
        let list = [];
        let idList = [];
        const addressList = localStorage.getItem("addresses");
        const userList = localStorage.getItem("userList");
        const identityList = localStorage.getItem("identityList");
        if(identityList !== null){
            idList = JSON.parse(identityList);
        }
        if(userList !== null){
            list = JSON.parse(userList);
        }
        if (addressList.includes(wallet.address)) {
            idList.push({[userName]:  localStorage.getItem("identityId")});
            setErrorMessage(false);
            setLoader(false);
            list.push(userName);
            localStorage.setItem("userList", JSON.stringify(list));
            localStorage.setItem("userName", userName);
            localStorage.setItem("identityList",  JSON.stringify(idList));

            history.push('/profile');
        } else {
            setLoader(false);
            setIdErrorMessage('Address Not Present');
        }
        console.log("address", wallet.address);
    };

    const handleKepler = () =>{
        setLoader(true);
        const kepler = KeplerWallet();
        kepler.then(function () {
            const keplrAddress = localStorage.getItem("keplerAddress");
            let list = [];
            let idList = [];
            const addressList = localStorage.getItem("addresses");
            const userList = localStorage.getItem("userList");
            const identityList = localStorage.getItem("identityList");
            if(identityList !== null){
                idList = JSON.parse(identityList);
            }
            if(userList !== null){
                list = JSON.parse(userList);
            }
            if (addressList.includes(keplrAddress)) {
                idList.push({[userName]:  localStorage.getItem("identityId")});
                list.push(userName);
                localStorage.setItem("userList", JSON.stringify(list));
                localStorage.setItem("userName", userName);
                localStorage.setItem("identityList",  JSON.stringify(idList));
                setErrorMessage(false);
                setLoader(false);
                history.push('/profile');
            } else {
                setLoader(false);
                setIdErrorMessage('Keplr address not found in identity list');
            }
        }).catch(err => {
            setLoader(false);
            setErrorMessage(err.message);
        });
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
    return (
        <div>
            <Modal show={show} onHide={handleClose}  className="mnemonic-login-section login-section" centered>
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

                    {loginForm ?
                        <>
                            <div className="mrt-10">
                                <div className="button-view">
                                    <div className="icon-section">
                                        <div className="icon"><img src={MnemonicIcon} alt="MnemonicIcon"/> </div>
                                        {t("LOGIN_WITH_USER_NAME")}</div>
                                    <Icon viewClass="arrow-icon" icon="arrow" />
                                </div>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                <Form.Control type="text" name="userName"
                                    placeholder={t("ENTER_USER_NAME")}
                                    required={true}/>
                                {errorMessage ?
                                    <div className="login-error"><p className="error-response">UserName Not Exist</p></div>
                                    : ""
                                }
                                {idErrorMessage !== "" ?
                                    <div className="login-error"><p className="error-response">{idErrorMessage}</p></div>
                                    : ""
                                }
                                <div className="submitButtonSection">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="button-double-border"
                                    >
                                        {t("LOGIN")}
                                    </Button>
                                </div>
                            </Form>
                        </>
                        :
                        <Form onSubmit={keyStoreSubmitHandler}>
                            <>
                                <Form.Group>
                                    <Form.File id="exampleFormControlFile1" name="uploadFile" accept=".json" label="upload private key file" required={true} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>{t("DECRYPT_KEY_STORE")}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="password"
                                        required={true}
                                    />
                                </Form.Group>
                            </>

                            <div className="submitButtonSection">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="button-double-border"
                                >
                                    {t("SUBMIT")}
                                </Button>
                            </div>
                            <div className="submitButtonSection">
                                <button type={"button"} variant="primary" className="button-double-border" onClick={handleKepler}>{t("USE_KEPLR")}
                                </button>
                            </div>
                            {idErrorMessage !== "" ?
                                <div className="login-error"><p className="error-response">{idErrorMessage}</p></div>
                                : ""
                            }
                        </Form>
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
};

IdentityLogin.displayName = 'IdentityLogin';
export default IdentityLogin;
