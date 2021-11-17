import React from 'react';
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import transactions from "../../../utilities/Helpers/transactions";
import queries from "../../../utilities/Helpers/query";
import config from "../../../config";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/GetID";

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
                if (item.code) {
                    props.setSignUpError(item.rawLog);
                    props.setLoader(false);
                } else {
                    if (props.TransactionName === "nubid") {
                        props.setNubID(props.totalDefineObject.nubId);
                        const hashGenerate = GetMetaHelper.Hash(props.totalDefineObject.nubId);
                        const identityID = await GetID.getHashIdentityID(hashGenerate);
                        let totalData = {
                            fromID: identityID,
                            CoinAmountDenom: '5000000' + config.coinDenom,
                        };
                        props.setTestID(identityID);
                        let queryResponse = queries.transactionDefinition(wallet[1], userMnemonic, "normal", 'wrap', totalData);
                        queryResponse.then(async function () {
                            props.setResponse(item);
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
