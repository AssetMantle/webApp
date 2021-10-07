function  GetClassificationID(data) {
    return data.value.id.value.classificationID.value.idString;
}

function  GetIdentityID(identity) {
    return identity.value.id.value.classificationID.value.idString + "|" +
        identity.value.id.value.hashID.value.idString;
}

function GetAssetID(asset) {
    return asset.value.id.value.classificationID.value.idString + "|" +
        asset.value.id.value.hashID.value.idString;
}

function GetMakerOwnableID(data) {
    return data.value.id.value.makerOwnableID.value.idString;
}

function GetTakerOwnableID(data) {
    return data.value.id.value.takerOwnableID.value.idString;
}

function GetMakerID(data) {
    return data.value.id.value.makerID.value.idString;
}

function GetHashID(data) {
    return data.value.id.value.hashID.value.idString;
}

function GetOrderID(order) {
    return order.value.id.value.classificationID.value.idString + "*" +
        order.value.id.value.makerOwnableID.value.idString + "*" +
        order.value.id.value.takerOwnableID.value.idString + "*" +
        order.value.id.value.makerID.value.idString + "*" +
        order.value.id.value.hashID.value.idString;
}

function GetIdentityIDs(identities) {
    let idList = [];
    let $this = this;
    identities.forEach(function (identity) {
        idList.push($this.GetIdentityID(identity));
    });
    return idList;
}

function GetIdentityOwnableId(identity) {
    return identity.value.id.value.ownableID.value.idString;
}

function GetIdentityOwnableIds(identities) {
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