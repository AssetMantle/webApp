import React from 'react';
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import transactions from "../../../utilities/Helpers/transactions";
import queries from "../../../utilities/Helpers/query";
import config from "../../../config";
import GetMeta from "../../../utilities/Helpers/getMeta";

const SignUp = (props) => {
    const {t} = useTranslation();
    const GetMetaHelper = new GetMeta();
    const handleSubmit = async e => {
        e.preventDefault();
        props.setLoader(true);
        props.setSignUpError("");
        let userMnemonic = props.mnemonic;
        if (userMnemonic !== undefined) {
            const wallet = await transactions.MnemonicWalletWithPassphrase(userMnemonic, '');
            let queryResponse = queries.transactionDefinition(wallet[1], userMnemonic, "normal", props.TransactionName, props.totalDefineObject);
            queryResponse.then(async function (item) {
                console.log(item, "queryResponse");

                if (item.code) {
                    props.setSignUpError(item.rawLog);
                    props.setLoader(false);
                } else {
                    if (props.TransactionName === "nubid") {
                        props.setNubID(props.totalDefineObject.nubId);
                        const identityID = config.nubClassificationID+'|'+ GetMetaHelper.Hash(GetMetaHelper.Hash(props.totalDefineObject.nubId));
                        let totalData = {
                            fromID: identityID,
                            CoinAmountDenom: '5000000' + config.coinDenom,
                        };

                        props.setTestID(identityID);
                        let wrapResponse = queries.transactionDefinition(wallet[1], userMnemonic, "normal", 'wrap', totalData);
                        wrapResponse.then(async function (witem) {
                            props.setResponse(item);
                            console.log(witem, "witem");

                            props.setLoader(false);
                            props.setShowEncrypt(false);
                        }).catch(err => {
                            console.log(err, "err wrap");
                        });
                    }
                }
            }).catch(err => {
                props.setLoader(false);
                props.setSignUpError(err.response
                    ? err.response.data.message
                    : err.message);
                console.log(err.response
                    ? err.response.data.message
                    : err.message, "rr");
                if (props.TransactionName === "nubid") {
                    localStorage.clear();
                }
            });
        } else {
            props.setLoader(false);
        }
    };
    return (
        <div className="submitButtonSection">
            <Button
                variant="primary"
                type="submit"
                onClick={handleSubmit}
            >
                {t('CONTINUE_TO_SIGN_UP')}
            </Button>
        </div>
    );
};


export default SignUp;
