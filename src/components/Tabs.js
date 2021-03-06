import React, {useState} from "react";
import {Button, Tab, Tabs} from "react-bootstrap";
import {Assets, Identities, Maintainers, MarketPlace, Orders} from "../containers/views";
import {SendCoin} from "../containers/forms/bank";
import {Reveal} from "../containers/forms/metas";
import {useTranslation} from "react-i18next";

const ActionsSwitcher = () => {
    const {t} = useTranslation();
    const [externalComponent, setExternalComponent] = useState("");
    const [key, setKey] = useState("home");

    const handleRoute = (route) => {
        setExternalComponent(route);
    };

    return (
        <div>
            <div>
            </div>
            <div className="tabs-top-bar">
                <div className="buttons">
                    <Button onClick={() => handleRoute("Reveal")}>{t("REVEAL_META")}</Button>
                    <Button onClick={() => handleRoute("SendCoin")}>{t("SEND_COIN")}</Button>
                </div>

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
