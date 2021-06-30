import React, {useState, useEffect} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import {cls} from "persistencejs/build/transaction/classification/query";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";

import CommonKeystore from '../login/CommonKeystore';
const classificationsQuery = new cls(process.env.REACT_APP_ASSET_MANTLE_API);

const Deputize = (props) => {
    const {t} = useTranslation();
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(true);
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [externalComponent, setExternalComponent] = useState("");
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [mutableList, setMutableList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const classificationId = props.maintainerData.value.id.value.classificationID.value.idString;
        const classificationResponse = classificationsQuery.queryClassificationWithID(classificationId);

        classificationResponse.then(function (item) {
            const data = JSON.parse(item);
            const mutablePropertyList = data.result.value.classifications.value.list[0].value.mutableTraits.value.properties.value.propertyList;
            setMutableList(mutablePropertyList);
        });
    }, []);

    const handleCheckMutableChange = evt => {
        const checkedValue = evt.target.checked;
        const name = evt.target.value;
        if (checkedValue) {
            const checkboxNames = evt.target.value;
            setCheckboxMutableNamesList((checkboxMutableNamesList) => [...checkboxMutableNamesList, checkboxNames]);
        } else {
            if (checkboxMutableNamesList.includes(name)) {
                setCheckboxMutableNamesList(checkboxMutableNamesList.filter(item => item !== name));
            }
        }
    };
    const handleSubmit = (event) => {
        setLoader(false);
        event.preventDefault();
        const classificationId = props.maintainerData.value.id.value.classificationID.value.idString;
        const identityId = props.maintainerData.value.id.value.identityID.value.idString;
        const addMaintainer = document.getElementById("addMaintainer").checked;
        const mutateMaintainer = document.getElementById("mutateMaintainer").checked;
        const removeMaintainer = document.getElementById("removeMaintainer").checked;
        let maintainedTraits = "";
        checkboxMutableNamesList.forEach((checkboxMutableName) => {
            if (maintainedTraits === "") {
                maintainedTraits = maintainedTraits + checkboxMutableName;
            }
            else{
                maintainedTraits = maintainedTraits + "," + checkboxMutableName;
            }
        });
        const ToId = event.target.ToId.value;
        if (maintainedTraits !== "") {
            let totalData = {
                identityId:identityId,
                classificationId:classificationId,
                toId:ToId,
                maintainedTraits:maintainedTraits,
                addMaintainer:addMaintainer,
                removeMaintainer:removeMaintainer,
                mutateMaintainer:mutateMaintainer
            };
            setTotalDefineObject(totalData);
            setExternalComponent('Keystore');
            setShow(false);
            setLoader(false);
            // const DeputizeResponse = deputizeMaintainer.deputize(userAddress, "test", userTypeToken, identityId, classificationId, ToId, maintainedTraits, addMaintainer, removeMaintainer, mutateMaintainer, config.feesAmount, config.feesToken, config.gas, config.mode);
            // DeputizeResponse.then(function (item) {
            //     const data = JSON.parse(JSON.stringify(item));
            //     setResponse(data);
            //     setShow(false);
            //     setLoader(false);
            // });
        } else {
            setErrorMessage(t("SELECT_ANY_MUTABLE_TRAITS"));
            setLoader(false);
        }

    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    return (
        <div>
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
                            <Form.Label> {t("TO_ID")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="ToId"
                                required={true}
                                placeholder={t("TO_ID")}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Check custom type="checkbox" label="Can add"
                                name="addMaintainer"
                                id="addMaintainer"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check custom type="checkbox" label="Can mutate"
                                name="mutateMaintainer"
                                id="mutateMaintainer"
                            />
                        </Form.Group>
                        <Form.Group>
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
                                    );
                                })
                                : ""
                            }
                        </div>
                        {errorMessage !== "" ?
                            <p className="error-response">{errorMessage}</p>
                            : ""
                        }
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t("SUBMIT")}
                            </Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
            {
                externalComponent === 'Keystore' ?
                    <CommonKeystore setExternalComponent={setExternalComponent} totalDefineObject={totalDefineObject} TransactionName={'deputize'}/> :
                    null
            }
        </div>
    );
};

export default Deputize;
