import React, {useContext} from "react";
import {Accordion, Card, useAccordionToggle, AccordionContext} from "react-bootstrap";
import Icon from "../icons";
import {useTranslation} from "react-i18next";
import config from "../constants/config"

function ContextAwareToggle({children, eventKey, callback}) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
        <Card.Header onClick={decoratedOnClick}>
            <p>
                Chain Info
            </p>
            <button
                type="button"
                className="accordion-button"
            >
                <Icon viewClass="icon" icon={isCurrentEventKey ? "up-arrow" : "down-arrow"}/>

            </button>
        </Card.Header>
    );
}

const ChainInfo = (props) => {
    const {t} = useTranslation();
    return (
        <section className="chain-section">
            <div className="info">
                <Accordion>
                    <Card>
                        <ContextAwareToggle as={Card.Header} eventKey="0">Click me!</ContextAwareToggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <div className="chain-info-item">
                                    <p>ClassificationID</p>
                                    <p>{config.AssetClassificationID}</p>
                                </div>
                                {props.makerOwanbleid ?
                                    <div className="chain-info-item">
                                        <p>AssetID</p>
                                        <p>{props.makerOwanbleid}</p>
                                    </div>
                                    :""
                                }
                                <div className="chain-info-item">
                                    <p>BlockChain</p>
                                    <p>Asset Mantle</p>
                                </div>

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </Accordion>
            </div>
        </section>
    )
}
export default ChainInfo;