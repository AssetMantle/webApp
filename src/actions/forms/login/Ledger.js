import React from "react";
import {Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const Ledger = () => {
    const { t } = useTranslation();
    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                {t("LEDGER_LOGIN")}
            </Modal.Header>
            <Modal.Body>
            <p>{t("LEDGER_CONNECT")}</p>
            </Modal.Body>

        </div>
    );
}
export default Ledger