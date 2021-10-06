import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import sidebarIcon from "../../assets/images/sidbarIcon.svg";
import Footer from "../../components/Footer";
import {Button} from "react-bootstrap";
import {Reveal} from "../../containers/forms/metas";
import {SendCoin} from "../../containers/forms/bank";
import {useHistory} from "react-router-dom";

const Sidebar = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const address = localStorage.getItem("userAddress");
    const [externalComponent, setExternalComponent] = useState("");
    const handleRoute = (route) => {
        if (address === '' || address === null) {
            history.push('/Login');
        }else {
            setExternalComponent(route);
        }
    };
    const [hideSideNav, setHideSideNav] = useState(false);
    const toggleClass = () => {
        setHideSideNav(!hideSideNav);
    };

    return (
        <div className={hideSideNav ? "side-bar active" : "side-bar"}>
            <div className="content">

                <div className="header-section">
                    <p>{t("MY_ACCOUNT")}</p>
                    <img src={sidebarIcon} alt="sidebarIcon" onClick={toggleClass}/>
                </div>
                <div className="sidebar-buttons">
                    <Button className="" onClick={() => handleRoute("Reveal")}>{t("REVEAL_META")}</Button>
                    <Button onClick={() => handleRoute("SendCoin")}>{t("SEND_COIN")}</Button>
                </div>
            </div>
            <Footer/>
            {externalComponent === 'Reveal' ?
                <Reveal setExternalComponent={setExternalComponent}/> :
                null
            }

            {externalComponent === 'SendCoin' ?
                <SendCoin setExternalComponent={setExternalComponent}/> :
                null
            }
        </div>
    );
};

export default Sidebar;
