import React, {useEffect, useState} from "react";
import {Tabs, Tab, Button} from "react-bootstrap";
import {Maintainers, Identities, Assets, Orders, MarketPlace} from "../actions/views"
import {SendCoin} from "../actions/forms/bank"
import {Reveal} from "../actions/forms/metas"
import axios from "axios";
import {getFaucet} from "../constants/url";
import {useTranslation} from "react-i18next";
import Loader from "../components/loader"

const ActionsSwitcher = () => {
    const {t} = useTranslation();
    const [loader, setLoader] = useState(false)
    const userAddress = localStorage.getItem('address');
    const [externalComponent, setExternalComponent] = useState("");
    const [accountResponse, setAccountResponse] = useState("");
    const [key, setKey] = useState("home");

    const handleRoute = (route) => {
        setExternalComponent(route)
    }

    const handleFaucet = () => {
        setLoader(true)
        const userAddress = localStorage.getItem('address');
        axios.post(process.env.REACT_APP_FAUCET_SERVER + "/faucetRequest", {address: userAddress})
            .then(response => {
                    setLoader(false)
                }
            )
            .catch(err => {
                setLoader(false)
            })
    };

    const url = getFaucet(userAddress);
    useEffect(() => {
        axios.get(url)
            .then((response) => {
                setAccountResponse(response.data.result.value)
            }).catch((error) => {
        });
    }, [])

    return (
        <div>
            <div>
                {loader ?
                    <Loader/>
                    : ""
                }
            </div>
            <div className="tabs-top-bar">
                <div className="buttons">
                    <Button onClick={() => handleRoute("Reveal")}>{t("REVEAL_META")}</Button>
                    <Button onClick={() => handleRoute("SendCoin")}>{t("SEND_COIN")}</Button>
                    {accountResponse.address == "" ?
                        <Button onClick={handleFaucet}>{t("FAUCET")}</Button>
                        : ""
                    }
                </div>
                {(accountResponse.coins !== undefined && accountResponse.coins.length) ?
                    <p>Amount: {accountResponse.coins[0].amount}
                    </p>
                    : "Amount: 0"
                }
            </div>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="assetTabs Tabs"
            >
                <Tab eventKey="home" title="Assets">
                    <Assets/>
                </Tab>
                <Tab eventKey="Identities" title="Identities">
                    <Identities/>
                </Tab>
                <Tab eventKey="profile" title="Orders">
                    <Orders/>
                </Tab>
                <Tab eventKey="contact" title="Maintainer">
                    <Maintainers/>
                </Tab>
                <Tab eventKey="marketPlace" title="MarketPlace">
                    <MarketPlace/>
                </Tab>
            </Tabs>
            <div>
                {externalComponent === 'Reveal' ?
                    <Reveal setExternalComponent={setExternalComponent}/> :
                    null
                }

                {externalComponent === 'SendCoin' ?
                    <SendCoin setExternalComponent={setExternalComponent}/> :
                    null
                }
            </div>
        </div>
    );
};

export default ActionsSwitcher;