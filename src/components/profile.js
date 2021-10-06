import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import Copy from "./copy";
import ledger from "../assets/images/ledger.svg";
import axios from "axios";
import {getFaucet} from "../constants/url";
import Icon from "../icons";

const Profile = () => {
    const {t} = useTranslation();
    const [accountResponse, setAccountResponse] = useState("");
    const userAddress = localStorage.getItem('userAddress');
    const url = getFaucet(userAddress);
    useEffect(() => {
        axios.get(url)
            .then((response) => {
                setAccountResponse(response.data.result.value);
                console.log(response.data.result.value, "PROFILE");
            }).catch((error) => {
                console.log(error, "error section");
            });
    }, []);

    return (
        <div className="profile-section">
            <div className="row card-deck">
                <div className="col-xl-9 col-lg-8 col-md-12 col-sm-12">
                    <div className="card profile-picture-section">
                        <div className="profile-picture">
                            <div className="image">
                            </div>
                            <div className="id-section">
                                <p className="id-string" title={userAddress}>{userAddress}</p>
                                <Copy
                                    id={userAddress}/>
                            </div>
                        </div>
                        <div className="list-item">
                            <p className="list-item-label">
                                {t("TOTAL_BALANCE")}
                            </p>
                            {(accountResponse.coins !== undefined && accountResponse.coins.length) ?
                                <p className="list-item-value"> {accountResponse.coins[0].amount}
                                </p>
                                : "0"
                            }
                        </div>
                        {/*<div className="list-item">*/}
                        {/*    <p className="list-item-label">*/}
                        {/*       {t("PENDING_TRANSACTIONS")}*/}
                        {/*    </p>*/}
                        {/*    <p className="list-item-value">0</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-12 col-sm-12">
                    <div className="card">
                        <h4 className="card-heading">{t("HARDWARE_DEVICES")}</h4>
                        <div className="ledger-box">
                            <div className="image-section">
                                <div className="ledger-image">
                                    <img src={ledger} alt="ledger"/>
                                </div>
                            </div>
                            <p className="heading">{t("ENABLE_LEDGER")}</p>
                            <div className="button-view" title="To be implemented">
                                <p className="icon-section">{t("CONNECT")}</p>
                                <Icon viewClass="arrow-icon" icon="arrow"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default Profile;
