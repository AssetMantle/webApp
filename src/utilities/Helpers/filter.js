const request = require('request');
import config from "../../constants/config.json";
import GetID from "./getID";

const GetIDHelper = new GetID();

export default class Filter {
    FilterIdentitiesByProvisionedAddress(identities, address) {
        return identities.filter(function filterFunc(identity) {
            if (identity.value.provisionedAddressList !== null) {
                return identity.value.provisionedAddressList.includes(address);
            }
        });
    }

    FilterSplitsByIdentities(identities, splits) {
        let identityOwnerIdlist = GetIDHelper.GetIdentityIDs(identities);
        return splits.filter(function filterFunc(split) {
            return identityOwnerIdlist.includes(split.value.id.value.ownerID.value.idString);
        });
    }

    FilterSplitsByIdentity(identityId, splits) {
        return splits.filter(function filterFunc(split) {
            return identityId === split.value.id.value.ownerID.value.idString;
        });
    }

    FilterOrdersByIdentities(identities, orders) {
        let identityOwnerIdlist = GetIDHelper.GetIdentityIDs(identities);
        return orders.filter(function filterFunc(order) {
            return identityOwnerIdlist.includes(order.value.id.value.makerID.value.idString);
        });
    }

    FilterOrdersByIdentity(identityId, orders) {
        return orders.filter(function filterFunc(order) {
            return identityId === order.value.id.value.makerID.value.idString;
        });
    }

    FilterMaintainersByIdentity(identityID, maintainers) {
        return maintainers.filter(function filterFunc(maintainer) {
            return identityID === maintainer.value.id.value.identityID.value.idString;
        });
    }

    FilterMaintainersByIdentities(identities, maintainers) {
        let identityOwnerIdlist = GetIDHelper.GetIdentityIDs(identities);
        return maintainers.filter(function filterFunc(maintainer) {
            return identityOwnerIdlist.includes(maintainer.value.id.value.identityID.value.idString);
        });
    }

    setTraitValues(checkboxMutableNamesList, mutableValues, MetaValues, inputName, mutableName, mutableType, mutableFieldValue) {
        let mutable = "";
        let meta = "";
        if (checkboxMutableNamesList.includes(inputName)) {
            if (MetaValues !== "") {
                meta = MetaValues + "," + mutableName + ":" + mutableType + "|" + mutableFieldValue;
            } else {
                meta = MetaValues + mutableName + ":" + mutableType + "|" + mutableFieldValue;
            }
        } else {
            if (mutableValues !== "") {
                mutable = mutableValues + "," + mutableName + ":" + mutableType + "|" + mutableFieldValue;
            } else {
                mutable = mutableValues + mutableName + ":" + mutableType + "|" + mutableFieldValue;
            }
        }
        let result = [mutable, meta];
        return result;
    }
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function queryTxHash(lcd, txHash) {
    return new Promise((resolve, reject) => {
        request(lcd + "/txs/" + txHash, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode !== 200) {
                reject('Invalid status code <' + response.statusCode + '>' + " response: " + body);
            }
            resolve(body);
        });
    });
}

export async function pollTxHash(lcd, txHash) {
    await delay(config.initialTxHashQueryDelay);
    for (let i = 0; i < config.numberOfRetries; i++) {
        try {
            return await queryTxHash(lcd, txHash);
        } catch (error) {
            console.log(error);
            console.log("retrying in " + config.scheduledTxHashQueryDelay + ": ", i, "th time");
            await delay(config.scheduledTxHashQueryDelay);
        }
    }
    return JSON.stringify({
        "txhash": txHash,
        "height": 0,
        "code": 111,
        "raw_log": "failed all retries"
    });
}
