import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import GetID from "../../../utilities/Helpers/getID";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import MnemonicIcon from "../../../assets/images/MnemonicIcon.svg";
import Icon from "../../../icons";
import Loader from '../../../components/loader';
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);

const IdentityLogin = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loader, setLoader] = useState(false);
    const [idErrorMessage, setIdErrorMessage] = useState("");
    const {t} = useTranslation();
    const GetIDHelper = new GetID();
    const handleSubmit = async event => {
        setLoader(true);
        localStorage.clear();
        event.preventDefault();
        setErrorMessage(false);
        setIdErrorMessage('');
        const IdentityName = event.target.identityname.value;
        const identities = identitiesQuery.queryIdentityWithID("all");
        if (identities) {
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                let count = 0;
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i].value.immutables.value.properties.value.propertyList !== null) {
                        const identityId = GetIDHelper.GetIdentityID(dataList[i]);
                        if(IdentityName === identityId) {
                            if(dataList[i].value.provisionedAddressList){
                                let addresses = dataList[i].value.provisionedAddressList;
                                console.log("response finale", dataList[i].value.provisionedAddressList);
                                localStorage.setItem('addresses', JSON.stringify(addresses));
                            }
                            let list = [];
                            const idList = localStorage.getItem("identityIDList");
                            if(idList !== null){
                                list = JSON.parse(idList);
                            }
                            if (list.includes(IdentityName)) {
                                setErrorMessage(false);
                                setLoader(false);
                                setIdErrorMessage('identityID already Added');
                            } else {
                                list.push(IdentityName);
                                setLoader(false);
                                localStorage.setItem("identityIDList", JSON.stringify(list));
                                localStorage.setItem("identityId", IdentityName);
                                history.push('/profile');
                            }
                            count = 0;
                            break;
                        } else {
                            count ++;
                        }
                    }
                }
                if(count !== 0){
                    setLoader(false);
                    setErrorMessage(true);
                }
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
                    <div className="mrt-10">
                        <div className="button-view">
                            <div className="icon-section">
                                <div className="icon"><img src={MnemonicIcon} alt="MnemonicIcon"/> </div>
                                {t("LOGIN_IDENTITY")}</div>
                            <Icon viewClass="arrow-icon" icon="arrow" />
                        </div>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Control type="text" name="identityname"
                            placeholder="Enter Identity ID"
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
                </Modal.Body>
            </Modal>
        </div>
    );
};

IdentityLogin.displayName = 'IdentityLogin';
export default IdentityLogin;
