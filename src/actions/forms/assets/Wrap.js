import React, {useState, useEffect} from "react";
import WrapJS from "persistencejs/transaction/splits/wrap";
import {Form, Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json"
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"

const WrapQuery = new WrapJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Wrap = (props) => {
    const {t} = useTranslation();
    const [response, setResponse] = useState({});
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false)

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const FromId = event.target.FromId.value;
        const CoinDenom = event.target.CoinDenom.value;
        const CoinAmount = event.target.CoinAmount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const WrapResponse = WrapQuery.wrap(userAddress, "test", userTypeToken, FromId, CoinAmount + CoinDenom, config.feesAmount, config.feesToken, config.gas, config.mode);
        WrapResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            setShow(false);
            setLoader(false)
        })
    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    return (
        <div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {props.FormName}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ""
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t("FROM_ID")} </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                placeholder="FromId"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t("COIN_DENOM")} </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="CoinDenom"
                                required={true}
                                placeholder="Coin Denom"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("COIN_AMOUNT")}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="CoinAmount"
                                required={true}
                                placeholder="Coin Amount"
                            />
                        </Form.Group>

                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t("SUBMIT")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose}/>
                : ""
            }
        </div>
    );
};

export default Wrap;
