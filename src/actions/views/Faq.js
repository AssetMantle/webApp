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
                                            {t("FAQ1_QUESTION")}
                                        </p>
                                        <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>{t("FAQ1_ANSWER")}</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <p>
                                            {t("FAQ2_QUESTION")}
                                        </p>
                                        <ContextAwareToggle eventKey="1">Click me!</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <p>{t("FAQ2_ANSWER")}
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