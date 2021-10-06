async function  GetClassificationID(data) {
    return data.value.id.value.classificationID.value.idString;
}

async function  GetIdentityID(identity) {
    return identity.value.id.value.classificationID.value.idString + "|" +
        identity.value.id.value.hashID.value.idString;
}

async function GetAssetID(asset) {
    return asset.value.id.value.classificationID.value.idString + "|" +
        asset.value.id.value.hashID.value.idString;
}

async function GetMakerOwnableID(data) {
    return data.value.id.value.makerOwnableID.value.idString;
}

async function GetTakerOwnableID(data) {
    return data.value.id.value.takerOwnableID.value.idString;
}

async function GetMakerID(data) {
    return data.value.id.value.makerID.value.idString;
}

async function GetHashID(data) {
    return data.value.id.value.hashID.value.idString;
}

async function GetOrderID(order) {
    return order.value.id.value.classificationID.value.idString + "*" +
        order.value.id.value.makerOwnableID.value.idString + "*" +
        order.value.id.value.takerOwnableID.value.idString + "*" +
        order.value.id.value.makerID.value.idString + "*" +
        order.value.id.value.hashID.value.idString;
}

async function GetIdentityIDs(identities) {
    let idList = [];
    let $this = this;
    identities.forEach(function (identity) {
        idList.push($this.GetIdentityID(identity));
    });
    return idList;
}

async function GetIdentityOwnableId(identity) {
    return identity.value.id.value.ownableID.value.idString;
}

async function GetIdentityOwnableIds(identities) {
    let ownableIdList = [];
    let $this = this;
    identities.forEach(function (identity) {
        ownableIdList.push($this.GetIdentityOwnableId(identity));
    });
    return ownableIdList;
}

export default {
    GetClassificationID,
    GetIdentityID,
    GetAssetID,
    GetMakerOwnableID,
    GetTakerOwnableID,
    GetMakerID,
    GetHashID,
    GetOrderID,
    GetIdentityIDs,
    GetIdentityOwnableId,
    GetIdentityOwnableIds
};