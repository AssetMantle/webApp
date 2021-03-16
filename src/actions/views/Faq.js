import React, {useContext} from "react";
import {Accordion, Card, useAccordionToggle, AccordionContext} from "react-bootstrap";
import Icon from "../../icons";
import {useTranslation} from "react-i18next";

function ContextAwareToggle({children, eventKey, callback}) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
        <button
            type="button"
            className="accordion-button"
            onClick={decoratedOnClick}
        >
            <Icon viewClass="icon" icon={isCurrentEventKey ? "up-arrow" : "down-arrow"}/>

        </button>
    );
}

const Faq = () => {
    const {t} = useTranslation();
    return (
        <section className="faq-section">
            <div className="container">
                <h3 className="section-title">Freaquently Asked Questions</h3>
                <div className="row">
                    <div className="col-md-6 data-section">
                        <div className="info">
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <p>
                                            What are NFTs?
                                        </p>
                                        <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body><p>A non-fungible token is a digital file whose unique identity and ownership are verified on a blockchain. NFTs are not mutually interchangeable. NFTs are commonly created by uploading files, such as digital artwork, to an auction market.</p></Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <p>
                                            What is the benefit of NFTs?
                                        </p>
                                        <ContextAwareToggle eventKey="1">Click me!</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <p>Owning a digital collectible versus a physical collectible like a Pokemon card or rare minted coin is that each NFT contains distinguishing information that makes it both distinct from any other NFT and easily verifiable. This makes the creation and circulation of fake collectibles pointless because each item can be traced back to the original issuer.
                                            </p>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Faq;