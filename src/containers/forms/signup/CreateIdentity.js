import React, {useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import {useHistory} from "react-router-dom";
import TransactionOptions from "../login/TransactionOptions";
import GetMeta from "../../../utilities/Helpers/getMeta";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
// import TransactionBar from "../../../components/TransactionBar";
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);

const CreateIdentity = () => {
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState('');
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(true);
    const [userName, setUserName] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const {t} = useTranslation();
    const history = useHistory();
    const GetMetaHelper = new GetMeta();

    const handleSubmit = async event => {
        setLoader(true);
        localStorage.clear();
        event.preventDefault();
        setErrorMessage(false);
        const IdentityName = event.target.userName.value;
        setUserName(IdentityName);
        const identities = identitiesQuery.queryIdentityWithID("all");
        if (identities) {
            identities.then(async function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                const hashGenerate = GetMetaHelper.Hash(IdentityName);
                let count = 0;
                if (dataList) {
                    for (var i = 0; i < dataList.length; i++) {
                        if (dataList[i].value.immutables.value.properties.value.propertyList !== null) {
                            const immutablePropertyList = dataList[i].value.immutables.value.properties.value.propertyList[0];
                            if (immutablePropertyList.value.fact.value.hash === hashGenerate) {
                                setLoader(false);
                                count = 0;
                                break;
                            } else {
                                count++;
                            }
                        }
                    }
                    if (count === 0) {
                        setLoader(false);
                        setErrorMessage(true);
                    } else {
                        let totalData = {
                            nubId: IdentityName,
                        };
                        setShow(false);
                        setTotalDefineObject(totalData);
                        setExternalComponent('Keystore');
                    }
                } else {
                    let totalData = {
                        nubId: IdentityName,
                    };
                    setShow(false);
                    setTotalDefineObject(totalData);
                    setExternalComponent('Keystore');
                }
            }).catch(err => {
                console.log(err, "in login");
                setLoader(false);
            });
        }
    };

    const handleChangeUserName = (evt) =>{
        setErrorMessage(false);
        if(evt.target.value.length > 30){
            evt.preventDefault();
        }
    };
    const handleClose = () => {
        setShow(false);
        history.push('/');
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
                    {t('SIGN_UP')}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="m-0">
                            <Form.Label>User Name*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="userName"
                                required={true}
                                placeholder="User Name"
                                label="User Name"
                                disabled={false}
                                onKeyPress={handleChangeUserName}
                            />
                        </Form.Group>
                        <div className="error-section"><p className="error-response">
                            {errorMessage ?
                                "UserName already taken"
                                : ""
                            }
                        </p>
                        </div>
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t('SUBMIT')}
                            </Button>
                        </div>
                    </Form>
                    {/*<TransactionBar/>*/}
                </Modal.Body>
            </Modal>
            <div>
                {
                    externalComponent === 'Keystore' ?
                        <TransactionOptions
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'nubid'}
                            setShow={setShow}
                            setLoader={setLoader}
                            userName={userName}
                            handleClose={handleClose}
                        /> :
                        null
                }
            </div>
        </div>
    );
};

export default CreateIdentity;

