import React, {useState} from "react";
import {Dropdown} from "react-bootstrap";
import {MintAsset, Wrap, UnWrap} from "../../forms/assets";
import AssetDefineJS from "persistencejs/transaction/assets/define";
import {Define} from "../../forms";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import AssetList from "./assetList";
import {Summary} from "../../../components/summary"

const assetDefine = new AssetDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)
const Assets = () => {
    const {t} = useTranslation();
    const [externalComponent, setExternalComponent] = useState("");

    const handleModalData = (formName) => {
        setExternalComponent(formName)
    }

    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>Assets</h4>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Actions
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleModalData("DefineAsset")}>{t("DEFINE_ASSET")}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleModalData("MintAsset")}>{t("MINT_ASSET")}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleModalData("Wrap")}>{t("WRAP")}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleModalData("UnWrap")}>{t("UN_WRAP")}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>


                        <AssetList/>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary />
                    </div>
                </div>
                <div>
                    {externalComponent === 'DefineAsset' ?
                        <Define setExternalComponent={setExternalComponent} ActionName={assetDefine}
                                FormName={'Define Asset'} type={'asset'}/> :
                        null
                    }
                    {
                        externalComponent === 'MintAsset' ?
                            <MintAsset setExternalComponent={setExternalComponent}/> :
                            null
                    }
                    {
                        externalComponent === 'Wrap' ?
                            <Wrap setExternalComponent={setExternalComponent} FormName={'Wrap'}/> :
                            null
                    }
                    {
                        externalComponent === 'UnWrap' ?
                            <UnWrap setExternalComponent={setExternalComponent} FormName={'UnWrap'}/> :
                            null
                    }
                </div>
            </div>
        </div>
    );
};

export default Assets;
