import React, {useState} from "react";
import identitiesDefineJS from "persistencejs/transaction/identity/define";
import {Dropdown} from "react-bootstrap";
import {Define} from "../../forms";
import {Nub, IssueIdentity} from "../../forms/identities";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import IdentityList from "./identityList";
import {Summary} from "../../../components/summary";

const identitiesDefine = new identitiesDefineJS(process.env.REACT_APP_ASSET_MANTLE_API);

const Identities = () => {
    const {t} = useTranslation();
    const [externalComponent, setExternalComponent] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [identity, setIdentity] = useState([]);
    const identityIddd = localStorage.getItem('address');
    console.log(identityIddd , "Sss");
    const handleModalData = (formName) => {
        setExternalComponent(formName);
        setIdentity(identity);
        setIdentityId(identityId);
    };

    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>Identities</h4>
                            <Dropdown>
                                <Dropdown.Toggle  id="dropdown-basic">
                                    {t("ACTIONS")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleModalData("Nub")}>{t("NUB")}</Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => handleModalData("DefineIdentity")}>{t("DEFINE_IDENTITY")}
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => handleModalData("IssueIdentity")}>{t("ISSUE_IDENTITY")}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <IdentityList/>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary/>
                    </div>

                </div>
            </div>
            <div>
                {externalComponent === 'Nub' ?
                    <Nub setExternalComponent={setExternalComponent}/> :
                    null
                }
                {externalComponent === 'DefineIdentity' ?
                    <Define setExternalComponent={setExternalComponent} ActionName={identitiesDefine}
                        FormName={'Define Identity'}/> :
                    null
                }
                {externalComponent === 'IssueIdentity' ?

                    <IssueIdentity setExternalComponent={setExternalComponent}/> :
                    null
                }
            </div>
        </div>
    );
};
export default Identities;
