import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import sidebarIcon from "../../assets/images/sidbarIcon.svg"
import Footer from "../../components/Footer"
import {Button} from "react-bootstrap";
import {getFaucet} from "../../constants/url";
import axios from "axios";
import {Reveal} from "../../actions/forms/metas";
import {SendCoin} from "../../actions/forms/bank";

const Sidebar = () => {
    const {t} = useTranslation();
    const userAddress = localStorage.getItem('address');
    const url = getFaucet(userAddress);
    const [externalComponent, setExternalComponent] = useState("");
    const [accountResponse, setAccountResponse] = useState("");
    const handleFaucet = () => {
        setLoader(true)
        const userAddress = localStorage.getItem('address');
        axios.post(process.env.REACT_APP_FAUCET_SERVER + "/faucetRequest", {address: userAddress})
            .then(response => {
                    console.log(response)
                    setLoader(false)
                }
            )
            .catch(err => {
                console.log(err)
                setLoader(false)
            })
    };
    const handleRoute = (route) => {
        setExternalComponent(route)
    }

    useEffect(() => {
        axios.get(url)
            .then((response) => {
                setAccountResponse(response.data.result.value)
            }).catch((error) => {
            console.log(error, "error section")
        });
    }, [])
    const [hideSideNav, setHideSideNav] = useState(false);
    const toggleClass = () => {
        setHideSideNav(!hideSideNav)
    }

    return (<div className={hideSideNav ? "side-bar active" : "side-bar"}>
            <div className="content">
                <div className="header-section">
                    <p>My Account</p>
                    <img src={sidebarIcon} alt="sidebarIcon" onClick={toggleClass}/>
                </div>
                <div className="sidebar-buttons">
                    <Button className="" onClick={() => handleRoute("Reveal")}>{t("REVEAL_META")}</Button>
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
}

export default Sidebar
