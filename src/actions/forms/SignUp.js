import React, { useState, useCallback } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import keyUtils from "persistencejs/utilities/keys";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesNubJS from "persistencejs/transaction/identity/nub";
import DownloadLink from "react-download-link";
import config from "../../constants/config.json"
import { getFaucet } from "../../constants/url";
import GetID from "../../utilities/Helpers/getID";
import { useTranslation } from "react-i18next";
import GetMeta from "../../utilities/Helpers/getMeta";
import axios from "axios";
import { pollTxHash } from "../../utilities/Helpers/filter"
import { useHistory } from "react-router-dom";
import Loader from "../../components/loader";
import Icon from "../../icons";
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesNub = new identitiesNubJS(process.env.REACT_APP_ASSET_MANTLE_API)
const SignUp = () => {
    const [response, setResponse] = useState({});
    const [loader, setLoader] = useState(false);
    const userAddress = localStorage.getItem('address');
    const url = getFaucet(userAddress);
    const { t } = useTranslation();
    const history = useHistory();
    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();
    const [show, setShow] = useState(true);
    const [jsonName, setJsonName] = useState({});
    const [showEncrypt, setShowEncrypt] = useState(false);
    const [mnemonic, setMnemonic] = useState("");
    const [formName, setFormName] = useState("");
    const [hashID, setHashId] = useState('');
    const [testID, settestID] = useState('');
    const [address, setAddress] = useState('');
    const [showDownload, setShowDownload] = useState(false);
    const [showFaucet, setShowFaucet] = useState(false);
    const [showDownloadModal, setshowDownloadModal] = useState(true);
    const [showtxnHash, setshowtxnHash] = useState(false);
    const [userExist, setuserExist] = useState(false);
    const handleClose = () => {
        setShow(false)
        history.push('/');
    };
    const handleFaucet = () => {
        setLoader(true)

        axios.post(process.env.REACT_APP_FAUCET_SERVER + "/faucetRequest", { address: userAddress })
            .then(response => {
                setLoader(false)
            }
            )
            .catch(err => {
                setLoader(false)
            })

        setShowDownload(false)
        setshowDownloadModal(false)
        setShowFaucet(true)
        setshowtxnHash(false)
    }
    const handleCloseEncrypt = () => {
        setShowEncrypt(false)
        history.push('/');
    };
    const getIdentityId = (userIdHash) => {
        const identities = identitiesQuery.queryIdentityWithID("all")
        if (identities) {
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                dataList.map((identity, index) => {
                    if (identity.value.immutables.value.properties.value.propertyList !== null) {
                        const immutablePropertyList = identity.value.immutables.value.properties.value.propertyList[0];
                      
                        if (immutablePropertyList.value.fact.value.hash === userIdHash) { 
                            const identityId = GetIDHelper.GetIdentityID(identity);

                            settestID(identityId)
                        }
                    }
                });

            })
        }
    }
    const handleSubmitIdentity = e => {
        console.log('repeating')
        setLoader(true)
        e.preventDefault()
        const userid = document.getElementById("userName").value
        const hashGenerate = GetMetaHelper.Hash(userid)
        console.log(hashGenerate, 'hashGenerate')
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        console.log(userAddress, userTypeToken, userid, config.feesAmount, config.feesToken, config.gas, config.mode)
        const nubResponse = identitiesNub.nub(userAddress, "test", userTypeToken, userid, config.feesAmount, config.feesToken, config.gas, config.mode);
        nubResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            const pollResponse = pollTxHash(process.env.REACT_APP_ASSET_MANTLE_API, data.txhash);
            pollResponse.then(function (pollData) {
                const pollObject = JSON.parse(pollData);
                if (pollObject.code) {
                    console.log('code is there');
                    setLoader(false)
                    setuserExist(true)
                } else {
                    getIdentityId(hashGenerate);
                    setLoader(false)
                    setShowFaucet(false)
                    setshowtxnHash(true)
                }
                console.log(pollObject, "pollObject")
            })
            setResponse(data)
            console.log(userid, data)
            setshowDownloadModal(false)
            setShowDownload(false)


            setHashId(hashGenerate);
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        const password = document.getElementById("password").value
        const error = keyUtils.createRandomWallet()
        if (error.error != null) {
            return (<div>ERROR!!</div>)
        }

        const create = keyUtils.createStore(error.mnemonic, password)
        if (create.error != null) {
            return (<div>ERROR!!</div>)
        }
        const jsonContent = JSON.stringify(create.Response);
        localStorage.setItem("address", error.address)
        localStorage.setItem("mnemonic", error.mnemonic)
        setJsonName(jsonContent)
        setAddress(error.address)
        setMnemonic(error.mnemonic)
        setShowEncrypt(true)
        setshowDownloadModal(false)
        setShowDownload(true)
        setshowtxnHash(false)
    }

    const handleEncrypt = (name) => {
        setShow(false)
        setFormName(name)
        setShowEncrypt(true)
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} className="signup-section" centered>
                <Modal.Header closeButton>
                    {t("SIGNING_UP")}
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <p>({t("SIGNUP_NOTE")})</p>
                        <div>
                            <Button
                                variant="primary"
                                className="button-signup-mnemonic button-signup"
                                onClick={() => handleEncrypt("SignUp with PrivateKey")}
                            >
                                {t("MNEMONIC")}/{t("PRIVATE_KEY")}
                            </Button>
                            <Button
                                variant="primary"
                                className="button-signup button-signup-ledger disabled"
                            >
                                {t("LEDGER_STORE")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Check custom type="checkbox" label="Accept Terms&Conditions"
                        name="removeMaintainer"
                        id="removeMaintainer"
                    />
                </Modal.Footer>
            </Modal>
            <Modal
                show={showEncrypt}
                onHide={handleCloseEncrypt}
                centered
                className="signup-section"
            >
                <Modal.Header closeButton>
                    {formName}
                </Modal.Header>
                <Modal.Body className="private-key">
                    {showDownloadModal ?
                        <Form onSubmit={handleSubmit}>
                            <Form.Label>{t("ENCRYPT_KEY_STORE")}</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                id="password"
                                placeholder="password"
                                required={true}
                            />
                            <div className="submitButtonSection">
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    {t("NEXT")}
                                </Button>
                            </div>
                        </Form>
                        : ""
                    }
                    {showDownload ?
                        <div>

                            <p className="mnemonic-note">({t("SAVE_MNEMONIC")}) </p>
                            <p className="mnemonic-text">{mnemonic}</p>
                            <p>{address}</p>
                            <p className="key-download">
                                <DownloadLink
                                    label="Download Key File for future use"
                                    filename="key.json"
                                    exportFile={() => `${jsonName}`}
                                />
                                <Icon viewClass="arrow-icon" icon="arrow" />
                            </p>
                            <p className="download-note">({t("DOWNLOAD_KEY")})</p>
                            <Button
                                variant="primary"
                                onClick={handleFaucet}
                            >
                                {t("FAUCET")}
                            </Button>
                        </div>
                        :
                        ""
                    }
                    {showFaucet ?
                        <Form onSubmit={handleSubmitIdentity}>
                            <Form.Label>{t("ENTER_USER_NAME")}</Form.Label>
                            <Form.Control
                                type="text"
                                name="text"
                                id="userName"
                                placeholder="UserName"
                                required={true}
                            />
                            <div className="submitButtonSection">
                                <Button
                                    variant="primary"

                                    type="submit"
                                >
                                    {t("SUBMIT")}
                                </Button>
                                {userExist ?
                                    <p>User already Exist</p>
                                    : ""}
                            </div>

                        </Form>
                        : ""
                    }
                   
                    {loader ?
                        <Loader />
                        : ""
                    }
                    {showtxnHash ?
                        response.code ?
                            <p>Error: {response.raw_log}</p>
                            :
                            <p className="tx-hash">TxHash: <a href={process.env.REACT_APP_ASSET_MANTLE_API + '/txs/' + response.txhash} target="_blank">{response.txhash}</a> 
                            </p>

                        : ""}
                        {testID}
                </Modal.Body>
            </Modal>

        </div>
    );
}
export default SignUp