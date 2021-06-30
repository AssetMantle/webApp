import config from '../../config';
import Msgs from './Msgs';
import transactions from './transactions';
async function defineQuery(address, mnemonic, data, actionName, type) {
    const msgs = await actionName.createIdentityDefineMsg(address, 'test', data.fromID, data.mutablePropertyValue, data.immutablePropertyValue, data.mutableMetaPropertyValue, data.immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode);
    console.log(msgs, 'msgs from pj', type);
    if(type === "keplr"){
        return await transactions.TransactionWithKeplr([msgs.value.msg[0]], Msgs.Fee(0, 200000), "", process.env.REACT_APP_CHAIN_ID);
    }else {
        return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
    }
}

async function defineAssetQuery(address, mnemonic, data, actionName,type) {
    const msgs = await actionName.createAssetDefineMsg(address, 'test', data.fromID, data.mutablePropertyValue, data.immutablePropertyValue, data.mutableMetaPropertyValue, data.immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode);
    console.log(msgs, 'msgs defineAssetQuery',);
    if(type === "keplr"){
        return await transactions.TransactionWithKeplr([msgs.value.msg[0]], Msgs.Fee(0, 200000), "", process.env.REACT_APP_CHAIN_ID);
    }else {
        return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
    }
}

async function defineOrderQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createOrderDefineMsg(address, 'test', data.fromID, data.mutablePropertyValue, data.immutablePropertyValue, data.mutableMetaPropertyValue, data.immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode);
    console.log(msgs, 'msgs defineOrderQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
}

async function mintAssetQuery(address, mnemonic, data, actionName, type) {
    const msgs = await actionName.createAssetMintMsg(address, 'test', data.toID, data.fromID, data.classificationId, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, 400000, config.mode);
    console.log(msgs, 'msgs mintAssetQuery');
    if(type === "keplr"){
        return await transactions.TransactionWithKeplr([msgs.value.msg[0]], Msgs.Fee(0, 200000), "", process.env.REACT_APP_CHAIN_ID);
    }else {
        return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
    }
    // return await actionName.mint(address, "test", mnemonic, data.toID, data.FromId, data.classificationId, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, config.gas, config.mode);
}

async function wrapQuery(address, mnemonic, data, actionName) {
    console.log(address, mnemonic, data, actionName, 'msgs wrapQuery');
    const msgs = await actionName.createSplitsWrapMsg(address, 'test', data.fromID, data.CoinAmountDenom, config.feesAmount, config.feesToken, config.gas, '');

    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
    // // return await actionName.wrap(address, "test", mnemonic, data.FromId, data.CoinAmountDenom, config.feesAmount, config.feesToken, config.gas, config.mode);
}

async function unWrapQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createSplitsUnwrapMsg(address, 'test', data.fromID, data.OwnableId, data.Split, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs unWrapQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
    // return await actionName.unwrap(address, "test", mnemonic, data.FromId, data.OwnableId, data.Split, config.feesAmount, config.feesToken, config.gas, config.mode);
}

async function nubIdQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createIdentityNubMsg(address, 'test', data.nubId, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs unWrapQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
    // return await actionName.nub(address, "test", mnemonic, data.nubId, config.feesAmount, config.feesToken, config.gas, config.mode);
}

async function issueIdentityQuery(address, mnemonic, data, actionName, type) {
    const msgs = await actionName.createIdentityIssueMsg(address, 'test', data.toAddress, data.fromID, data.classificationId, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs unWrapQuery');
    if(type === "keplr"){
        return await transactions.TransactionWithKeplr([msgs.value.msg[0]], Msgs.Fee(0, 200000), "", process.env.REACT_APP_CHAIN_ID);
    }else {
        return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
    }

    // return await actionName.issue(address, "test", mnemonic, data.toAddress, data.FromId, data.classificationId, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, config.gas, config.mode);
}

async function sendCoinQuery(address, mnemonic, data, actionName, type) {
    const msgs = await actionName.createSendCoinMsg(address, 'test', mnemonic, data.denom, data.amountData, config.feesAmount, config.feesToken, config.gas, '');
    if(type === "keplr"){
        return await transactions.TransactionWithKeplr([msgs.value.msg[0]], Msgs.Fee(0, 200000), "", process.env.REACT_APP_CHAIN_ID);
    }else {
        return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
    }
}

async function sendSplitsQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createSplitsSendMsg(address, 'test', data.fromID, data.IdentityID, data.ownableId, data.splitAmount, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs sendSplitsQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
}

async function makeOrderQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createOrderMakeMsg(address, 'test', data.fromID, data.classificationId, data.makerOwnableID, data.TakerOwnableId, data.ExpiresIn, data.Makersplit, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs makeOrderQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
}

async function mutateAssetQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createAssetMutateMsg(address, 'test', data.fromID, data.assetId, data.mutableValues, data.mutableMetaValues, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs mutateAssetQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
}

async function cancelOrderQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createOrderCancelMsg(address, 'test', data.fromID, data.orderID, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs cancelOrderQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
}

async function burnAassetQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createAssetBurnMsg(address, 'test', data.fromID, data.assetId, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs cancelOrderQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
}

async function deputizeQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createDeputizeMsg(address, 'test', data.identityId, data.classificationId, data.toId, data.maintainedTraits, data.addMaintainer, data.removeMaintainer, data.mutateMaintainer, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs deputizeQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
}

async function provisionQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createIdentityProvisionMsg(address, 'test', data.identityId, data.to, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs provisionQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
}

async function unProvisionQuery(address, mnemonic, data, actionName) {
    const msgs = await actionName.createIdentityUnprovisionMsg(address, 'test', data.identityId, data.to, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs provisionQuery');
    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
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
};
