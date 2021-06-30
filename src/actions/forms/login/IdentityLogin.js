import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import GetID from "../../../utilities/Helpers/getID";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import MnemonicIcon from "../../../assets/images/MnemonicIcon.svg";
import Icon from "../../../icons";
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);

const IdentityLogin = React.memo((props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const {t} = useTranslation();
    const GetIDHelper = new GetID();
    const handleSubmit = async event => {
        event.preventDefault();
        const IdentityName = event.target.identityname.value;
        const identities = identitiesQuery.queryIdentityWithID("all");
        if (identities) {
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                dataList.map((identity) => {
                    if (identity.value.immutables.value.properties.value.propertyList !== null) {
                        const identityId = GetIDHelper.GetIdentityID(identity);
                        if(IdentityName === identityId) {
                            console.log(identity, "ggerr");
                            let address = identity.value.provisionedAddressList[0];
                            console.log(address, "ggerr");
                            localStorage.setItem("address", address);
                            localStorage.setItem("identityId", IdentityName);
                            history.push('/profile');
                        } else {
                            setErrorMessage(true);
                        }
                    }
                });
            });
        }
    };
    const handleClose = () => {
        setShow(false);
        history.push('/');
        props.setExternalComponent("");
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose}  className="mnemonic-login-section login-section" centered>
                <Modal.Header closeButton>
                    {t("LOGIN_FORM")}
                </Modal.Header>
                <Modal.Body>
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
});

IdentityLogin.displayName = 'IdentityLogin';
export default IdentityLogin;
