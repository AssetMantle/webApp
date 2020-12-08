import React, {useState, useEffect} from "react";
import deputizeJS from "persistencejs/transaction/maintainers/deputize";
import {Form, Button, Modal} from "react-bootstrap";
import ClassificationsQueryJS from "persistencejs/transaction/classification/query";
import {useTranslation} from "react-i18next";
import ModalCommon from "../../../components/modal";
import Loader from "../../../components/loader";

import config from "../../../constants/config.json"
const deputizeMaintainer = new deputizeJS(process.env.REACT_APP_ASSET_MANTLE_API)
const classificationsQuery = new ClassificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Deputize = (props) => {
    const {t} = useTranslation();
    const [loader, setLoader] = useState(false)
    const [show, setShow] = useState(true);
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [response, setResponse] = useState({});
    const [mutableList, setMutableList] = useState([]);

    useEffect(() => {
        const classificationId = props.maintainerData.value.id.value.classificationID.value.idString
        const classificationResponse = classificationsQuery.queryClassificationWithID(classificationId)

        classificationResponse.then(function (item) {
            const data = JSON.parse(item);
            const mutablePropertyList = data.result.value.classifications.value.list[0].value.mutableTraits.value.properties.value.propertyList;
            setMutableList(mutablePropertyList)
        })
    }, [])

    const handleCheckMutableChange = evt => {
        const checkedValue = evt.target.checked;
        const name = evt.target.value
        if (checkedValue) {
            const checkboxNames = evt.target.value;
            setCheckboxMutableNamesList((checkboxMutableNamesList) => [...checkboxMutableNamesList, checkboxNames]);
        } else {
            if (checkboxMutableNamesList.includes(name)) {
                setCheckboxMutableNamesList(checkboxMutableNamesList.filter(item => item !== name));
            }
        }
    }
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const classificationId = props.maintainerData.value.id.value.classificationID.value.idString
        const identityId = props.maintainerData.value.id.value.identityID.value.idString
        const addMaintainer = document.getElementById("addMaintainer").checked
        const mutateMaintainer = document.getElementById("mutateMaintainer").checked
        const removeMaintainer = document.getElementById("removeMaintainer").checked
        let maintainedTraits = ""
        checkboxMutableNamesList.forEach((checkboxMutableName) => {
            maintainedTraits = maintainedTraits + checkboxMutableName;
        })
        const ToId = event.target.ToId.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const DeputizeResponse = deputizeMaintainer.deputize(userAddress, "test", userTypeToken, identityId, classificationId, ToId, maintainedTraits, addMaintainer, removeMaintainer, mutateMaintainer, config.feesAmount, config.feesToken, config.gas, config.mode);
        DeputizeResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            setShow(false)
            setLoader(false);
        })

    };
    const handleClose = () => {
        setShow(false)
    };
    return (
        <div className="accountInfo">
            <Modal show={show} onHide={handleClose}  centered>
            <Modal.Header closeButton>
                {t("DEPUTIZE")}
            </Modal.Header>
                {loader ?
                    <Loader />
                    :""
                }
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label> {t("TO_ID")}</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="ToId"
                            required={true}
                            placeholder="ToId"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check custom type="checkbox" label="Can add"
                                    name="addMaintainer"
                                    id="addMaintainer"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check custom type="checkbox" label="Can mutate"
                                    name="mutateMaintainer"
                                    id="mutateMaintainer"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check custom type="checkbox" label="Can remove"
                                    name="removeMaintainer"
                                    id="removeMaintainer"
                        />
                    </Form.Group>
                    <div>
                        <p>Add maintainable Traits</p>
                        {mutableList !== null ?
                            mutableList.map((mutable, index) => {
                                const mutableType = mutable.value.fact.value.type;
                                const mutableName = mutable.value.id.value.idString;
                                return (
                                    <div key={index}>
                                        <Form.Group >
                                            <Form.Check custom type="checkbox" label={mutableName}
                                                        name={`${mutableName}:${mutableType}|${index}`}
                                                        id={`${mutableName}:${mutableType}|${index}`}
                                                        value={`${mutableName}:${mutableType}|`}
                                                        onClick={handleCheckMutableChange}
                                            />
                                        </Form.Group>
                                    </div>
                                )
                            })
                            : ""
                        }
                    </div>
                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            {t("SUBMIT")}
                        </Button>
                    </div>

                </Form>
            </Modal.Body>
            </Modal>
                { !(Object.keys(response).length === 0) ?
                    <ModalCommon data={response}/>
                    :""
                }
        </div>
    );
};

export default Deputize;
