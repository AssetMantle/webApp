import React, {useState, useEffect} from "react";
import UnWrapJS from "persistencejs/transaction/splits/unwrap";
import {Form, Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json"
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"

const UnWrapQuery = new UnWrapJS(process.env.REACT_APP_ASSET_MANTLE_API)

const UnWrap = (props) => {
    const [response, setResponse] = useState({});
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false)
    const {t} = useTranslation();
    const [fromID, setFromID] = useState("");

    useEffect(()=>{
        let fromIDValue = localStorage.getItem('fromID');
        setFromID(fromIDValue);
    },[])

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const FromId = event.target.FromId.value;
        const OwnableId = event.target.OwnableId.value;
        const Split = event.target.Split.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const UnWrapResponse = UnWrapQuery.unwrap(userAddress, "test", userTypeToken, FromId, OwnableId, Split, config.feesAmount, config.feesToken, config.gas, config.mode);
        UnWrapResponse.then(function (item) {
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
            <Modal show={show} onHide={handleClose}  centered>
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
                            <Form.Label>{t("FROM_ID")}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                defaultValue={fromID !== null ? fromID : ""}
                                required={true}
                                placeholder="FromId"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t("OWNABLE_ID")}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="OwnableId"
                                required={true}
                                placeholder="Ownable Id"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("SPLIT")}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="Split"
                                required={true}
                                placeholder="Split"
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

export default UnWrap;
