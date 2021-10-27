import React from 'react';
import {useTranslation} from "react-i18next";
import logo from "../assets/images/logo.svg";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Icon from "../icons";
const Footer = () => {
    const {t} = useTranslation();
    const socialList = [
        {
            url: "asdfadf",
            iconName: 'twitter-logo',
            tooltip: 'twitter'
        }, {
            url:  "PERSISTENCEONE_MEDIUM_URL" ,
            iconName: 'medium',
            tooltip: 'medium'
        },
    ];
    return (
       
        <div className="footer">
            <div className="container">
                <div className="top-section">
                    <div className="logo">
                        <img src={logo} alt="logo"/>
                    </div>
                    <p className="footer-text"> © {new Date().getFullYear()}
                        <span className="link_color"> {t("APP_TITLE")} - Marketplace for NFTs </span>
                    </p>
                    {/*<div className="social-links-section">*/}
                    {/*    <ul className="list-unstyled footer-list">*/}
                    {/*        {*/}
                    {/*            socialList.map((item,) => (*/}
                    {/*                <OverlayTrigger*/}
                    {/*                    key={item.iconName}*/}
                    {/*                    placement="top"*/}
                    {/*                    overlay={*/}
                    {/*                        <Tooltip id={`tooltip-${item.iconName}}`}>*/}
                    {/*                            {item.tooltip}*/}
                    {/*                        </Tooltip>*/}
                    {/*                    }*/}
                    {/*                >*/}
                    {/*                    <a href={item.url}  rel="noopener noreferrer"*/}
                    {/*                        target="_blank"><Icon viewClass="social_icon_imgg"*/}
                    {/*                            icon={item.iconName} /></a>*/}
                    {/*                </OverlayTrigger>*/}
                    {/*            ))*/}
                    {/*        }*/}
                    
                    {/*    </ul>*/}
                    {/*</div>*/}

                </div>
                <div className="bottom-section">
                    <div className="blogs">
                        <p className="help">
                            Blog
                        </p>
                        <p className="blog">
                            Docs
                        </p>
                        <p className="kit">
                        Terms of Service
                        </p>
                    </div>
                    <div className="bottom-right-section">
                        <div className="social-links-section">
                            <ul className="list-unstyled footer-list">
                                {
                                    socialList.map((item,) => (
                                        <OverlayTrigger
                                            key={item.iconName}
                                            placement="top"
                                            overlay={
                                                <Tooltip id={`tooltip-${item.iconName}}`}>
                                                    {item.tooltip}
                                                </Tooltip>
                                            }
                                        >
                                            <a href={item.url}  rel="noopener noreferrer"
                                                target="_blank"><Icon viewClass="social_icon_imgg"
                                                    icon={item.iconName} /></a>
                                        </OverlayTrigger>
                                    ))
                                }

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
    );
};

export default Footer;
