import config from '../../config';
import Msgs from './Msgs';
import transactions from './transactions';
import {wrapSplits} from "persistencejs/build/transaction/splits/wrap";
import {unwrapsplits} from "persistencejs/build/transaction/splits/unwrap";
import {issueIdentity} from "persistencejs/build/transaction/identity/issue";
import {nubIdentity} from "persistencejs/build/transaction/identity/nub";
import {defineIdentity} from "persistencejs/build/transaction/identity/define";
import {defineAsset} from 'persistencejs/build/transaction/assets/define';
import {defineOrder} from 'persistencejs/build/transaction/orders/define';
import {sendSplits} from 'persistencejs/build/transaction/splits/send';
import {makeOrder} from 'persistencejs/build/transaction/orders/make';
import {mutateAsset} from 'persistencejs/build/transaction/assets/mutate';
import {cancelOrder} from 'persistencejs/build/transaction/orders/cancel';
import {burnAsset} from 'persistencejs/build/transaction/assets/burn';
import {deputizeMaintainer as dm} from 'persistencejs/build/transaction/maintainers/deputize';
import {provisionIdentity} from 'persistencejs/build/transaction/identity/provision';
import {unprovisionIdentity} from 'persistencejs/build/transaction/identity/unprovision';
import {takeOrder} from 'persistencejs/build/transaction/orders/take';
import {revealMeta} from 'persistencejs/build/transaction/meta/reveal';
import {queryIdentities} from 'persistencejs/build/transaction/identity/query';
import {mintAsset} from "persistencejs/build/transaction/assets/mint";
import {bank} from "persistencejs/build/transaction/bank/sendCoin";
const identitiesDefine = new defineIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const assetDefine = new defineAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const ordersDefine = new defineOrder(process.env.REACT_APP_ASSET_MANTLE_API);
const assetMint = new mintAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const SendCoinQuery = new bank(process.env.REACT_APP_ASSET_MANTLE_API);
const WrapQuery = new wrapSplits(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesIssue = new issueIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesNub = new nubIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const UnWrapQuery = new unwrapsplits(process.env.REACT_APP_ASSET_MANTLE_API);
const sendSplitQuery = new sendSplits(process.env.REACT_APP_ASSET_MANTLE_API);
const ordersMake = new makeOrder(process.env.REACT_APP_ASSET_MANTLE_API);
const assetMutate = new mutateAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const ordersCancel = new cancelOrder(process.env.REACT_APP_ASSET_MANTLE_API);
const assetBurn = new burnAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const deputizeMaintainer = new dm(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesProvision = new provisionIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesUnprovision = new unprovisionIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const orderTake = new takeOrder(process.env.REACT_APP_ASSET_MANTLE_API);
const RevealMeta = new revealMeta(process.env.REACT_APP_ASSET_MANTLE_API);
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

async function wrapQuery(address, mnemonic, data, actionName,type, txName) {
    const msgs = await actionName.createSplitsWrapMsg(address, config.chainID, data.fromID, data.CoinAmountDenom, config.feesAmount, config.feesToken, config.gas, '');
    console.log(msgs, 'msgs wrapQuery');
    return makeTransaction(address, msgs, mnemonic, type, txName);
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
    if(txName !== 'nub' && txName !== 'wrap') {
        const addressList = await getProvisionList();
        console.log(addressList, address, "in check");
        if (addressList || addressList.length) {
            if (addressList.includes(address)) {
                if (type === "keplr") {
                    return await transactions.TransactionWithKeplr([msgs.value.msg[0]], Msgs.Fee(0, 200000), "", process.env.REACT_APP_CHAIN_ID);
                } else {
                    return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic, type);
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
            return await transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic, type);
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

const transactionDefination = async (address, userMnemonic, type, TransactionName, totalDefineObject ) => {
    let queryResponse;
    if (TransactionName === 'assetMint') {
        queryResponse = mintAssetQuery(address, userMnemonic, totalDefineObject, assetMint, type);
    }  else if (TransactionName === 'wrap') {
        queryResponse = wrapQuery(address, userMnemonic, totalDefineObject, WrapQuery, type, "wrap");
    }  else if (TransactionName === 'unwrap') {
        queryResponse = unWrapQuery(address, userMnemonic, totalDefineObject, UnWrapQuery, type);
    }  else if (TransactionName === 'nubid') {
        console.log(address, userMnemonic, totalDefineObject, identitiesNub, type, 'nubIdQuery');
        queryResponse = nubIdQuery(address, userMnemonic, totalDefineObject, identitiesNub, type, 'nub');
    }  else if (TransactionName === 'issueidentity') {
        queryResponse = issueIdentityQuery(address, userMnemonic, totalDefineObject, identitiesIssue, type);
    } else if (TransactionName === 'Define Asset') {
        queryResponse = defineAssetQuery(address, userMnemonic, totalDefineObject, assetDefine, type);
    }  else if (TransactionName === 'Define Order') {
        queryResponse = defineOrderQuery(address, userMnemonic, totalDefineObject, ordersDefine, type);
    } else if (TransactionName === 'Define Identity') {
        queryResponse = defineQuery(address, userMnemonic, totalDefineObject, identitiesDefine, type);
    } else if (TransactionName === 'sendcoin') {
        queryResponse = sendCoinQuery(address, userMnemonic, totalDefineObject, SendCoinQuery,type);
    } else if (TransactionName === 'send splits') {
        queryResponse = sendSplitsQuery(address, userMnemonic, totalDefineObject, sendSplitQuery, type);
    } else if (TransactionName === 'make order') {
        queryResponse = makeOrderQuery(address, userMnemonic, totalDefineObject, ordersMake, type);
    }else if (TransactionName === 'take order') {
        queryResponse = takeOrderQuery(address, userMnemonic, totalDefineObject, orderTake, type);
    } else if (TransactionName === 'mutate Asset') {
        queryResponse = mutateAssetQuery(address, userMnemonic, totalDefineObject, assetMutate,type);
    } else if (TransactionName === 'cancel order') {
        queryResponse = cancelOrderQuery(address, userMnemonic, totalDefineObject, ordersCancel, type);
    } else if (TransactionName === 'burn asset') {
        queryResponse = burnAassetQuery(address, userMnemonic, totalDefineObject, assetBurn, type);
    } else if (TransactionName === 'deputize') {
        queryResponse = deputizeQuery(address, userMnemonic, totalDefineObject, deputizeMaintainer, type);
    } else if (TransactionName === 'provision') {
        queryResponse = provisionQuery(address, userMnemonic, totalDefineObject, identitiesProvision, type);
    } else if (TransactionName === 'un provision') {
        queryResponse = unProvisionQuery(address, userMnemonic, totalDefineObject, identitiesUnprovision, type);
    } else if (TransactionName === 'reveal') {
        queryResponse = revealHashQuery(address, userMnemonic, totalDefineObject, RevealMeta, type);
    }
    return queryResponse;
};

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
    transactionDefination,
};
