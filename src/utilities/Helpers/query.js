import config from '../../config';
import Msgs from './Msgs';
import transactions from './transactions';
import {queryIdentities} from 'persistencejs/build/transaction/identity/query';
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);

async function defineQuery(address, mnemonic, data, actionName, type) {
    const msgs = await actionName.createIdentityDefineMsg(address, config.chainID, data.fromID, data.mutablePropertyValue, data.immutablePropertyValue, data.mutableMetaPropertyValue, data.immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode);
    return makeTransaction(address, msgs, mnemonic, type);
}

async function defineAssetQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createAssetDefineMsg(address, config.chainID, data.fromID, data.mutablePropertyValue, data.immutablePropertyValue, data.mutableMetaPropertyValue, data.immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode);
    console.log(msgs, 'msgs defineAssetQuery',);
    return makeTransaction(address, msgs, mnemonic, type);
}

async function defineOrderQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createOrderDefineMsg(address, config.chainID, data.fromID, data.mutablePropertyValue, data.immutablePropertyValue, data.mutableMetaPropertyValue, data.immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode);
    console.log(msgs, 'msgs defineOrderQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function mintAssetQuery(address, mnemonic, data, actionName, type) {
    const msgs = await actionName.createAssetMintMsg(address, config.chainID, data.toID, data.fromID, data.classificationId, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, 400000, config.mode);
    console.log(msgs, 'msgs mintAssetQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function wrapQuery(address, mnemonic, data, actionName,type) {
    console.log(address, mnemonic, data, actionName, 'msgs wrapQuery');
    const msgs = await actionName.createSplitsWrapMsg(address, config.chainID, data.fromID, data.CoinAmountDenom, config.feesAmount, config.feesToken, config.gas, '');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function unWrapQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createSplitsUnwrapMsg(address, config.chainID, data.fromID, data.OwnableId, data.Split, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs unWrapQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function nubIdQuery(address, mnemonic, data, actionName,type, txName) {
    const msgs = await actionName.createIdentityNubMsg(address, config.chainID, data.nubId, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs nubIdQuery');
    return makeTransaction(address, msgs, mnemonic, type, txName);
}

async function issueIdentityQuery(address, mnemonic, data, actionName, type) {
    const msgs = await actionName.createIdentityIssueMsg(address, config.chainID, data.toAddress, data.fromID, data.classificationId, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs unWrapQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function sendCoinQuery(address, mnemonic, data, actionName, type) {
    const msgs = await actionName.createSendCoinMsg(address, config.chainID, data.toAddress, data.denom, data.amountData, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs send Query');
    return makeTransaction(address, msgs,mnemonic, type);
}

async function sendSplitsQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createSplitsSendMsg(address, config.chainID, data.fromID, data.IdentityID, data.ownableId, data.splitAmount, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs sendSplitsQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function makeOrderQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createOrderMakeMsg(address, config.chainID, data.fromID, data.classificationId, data.makerOwnableID, data.TakerOwnableId, data.ExpiresIn, data.Makersplit, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs makeOrderQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function takeOrderQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createOrderTakeMsg(address, config.chainID, data.fromID, data.ownableAmount, data.orderId, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs takeOrderQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function mutateAssetQuery(address, mnemonic, data, actionName,type) {
    console.log(address, config.chainID, data.fromID, data.assetId, data.mutableValues, data.mutableMetaValues, config.feesAmount, config.feesToken, config.gas, '', 'msgs mutateAssetQuery');

    const msgs = await actionName.createAssetMutateMsg(address, config.chainID, data.fromID, data.assetId, data.mutableValues, data.mutableMetaValues, config.feesAmount, config.feesToken, config.gas, '')
        .catch((err)=>{
            console.log(err, 'error mutateAssetQuery');
        });
    console.log(msgs, 'msgs mutateAssetQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function cancelOrderQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createOrderCancelMsg(address, config.chainID, data.fromID, data.orderID, config.feesAmount, config.feesToken, config.gas, '');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function burnAassetQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createAssetBurnMsg(address, config.chainID, data.fromID, data.assetId, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs cancelOrderQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function deputizeQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createDeputizeMsg(address, config.chainID, data.identityId, data.classificationId, data.toId, data.maintainedTraits, data.addMaintainer, data.removeMaintainer, data.mutateMaintainer, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs deputizeQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function provisionQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createIdentityProvisionMsg(address, config.chainID, data.identityId, data.to, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs provisionQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function unProvisionQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createIdentityUnprovisionMsg(address, config.chainID, data.identityId, data.to, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs provisionQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}

async function revealHashQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createMetaRevealMsg(address, config.chainID, data.metaFact, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'revealHashQuery');
    return makeTransaction(address, msgs, mnemonic, type);
}


async function makeTransaction(address, msgs,mnemonic, type, txName){
    if(txName !== 'nub') {
        const addressList = await getProvisionList();
        console.log(addressList, address, "in check");
        if (addressList || addressList.length) {
            if (addressList.includes(address)) {
                if (type === "keplr") {
                    return await transactions.TransactionWithKeplr([msgs.value.msg[0]], Msgs.Fee(0, 200000), "", process.env.REACT_APP_CHAIN_ID);
                } else {
                    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
                }
            } else {
                localStorage.removeItem('encryptedMnemonic');
                throw new Error(`Provision address keystore address different please check. keystore address: ${address}, Provision address:${addressList[0]}`);
            }
        } else {
            throw new Error("provision address empty please add");
        }
    }else {
        if (type === "keplr") {
            return await transactions.TransactionWithKeplr([msgs.value.msg[0]], Msgs.Fee(0, 200000), "", process.env.REACT_APP_CHAIN_ID);
        } else {
            return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
        }
    }

}


async function getProvisionList() {
    const identityId = localStorage.getItem('identityId');
    const identities = await identitiesQuery.queryIdentityWithID(identityId);
    if (identities) {
        const data = JSON.parse(identities);
        const dataList = data.result.value.identities.value.list;
        if (dataList.length) {
            let provisionedAddressList = "";
            if (dataList[0].value.provisionedAddressList !== null) {
                provisionedAddressList = dataList[0].value.provisionedAddressList;
            }
            return provisionedAddressList;
        }
    }
}



export default {
    defineQuery,
    defineAssetQuery,
    wrapQuery,
    unWrapQuery,
    nubIdQuery,
    sendCoinQuery,
    issueIdentityQuery,
    mintAssetQuery,
    sendSplitsQuery,
    makeOrderQuery,
    mutateAssetQuery,
    cancelOrderQuery,
    burnAassetQuery,
    deputizeQuery,
    provisionQuery,
    unProvisionQuery,
    defineOrderQuery,
    takeOrderQuery,
    revealHashQuery,
};
