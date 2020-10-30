export default class Helper {

    GetIdentityID(identity) {
        return identity.value.id.value.classificationID.value.idString + "|" +
            identity.value.id.value.hashID.value.idString
    }

    GetAssetID(asset) {
        return asset.value.id.value.classificationID.value.idString + "|" +
            asset.value.id.value.hashID.value.idString
    }

    GetOrderID(order) {
        return order.value.id.value.classificationID.value.idString + +
                order.value.id.value.makerOwnableID.value.idString + "*" +
            order.value.id.value.takerOwnableID.value.idString + "*" +
            order.value.id.value.makerID.value.idString + "*" +
            order.value.id.value.hashID.value.idString
    }

    GetIdentityIDs(identities) {
        const idList = [];
        let $this = this
        identities.forEach(function (identity) {
            idList.push( $this.GetIdentityID(identity));
        })
        return idList;
    }

    FilterIdentitiesByProvisionedAddress(identities, address) {
        return identities.filter(function filterFunc(identity) {
            return identity.value.provisionedAddressList.includes(address)
        })
    }

    FilterSplitsByIdentity(identities, splits) {
        var identityOwnerIdlist = this.GetIdentityIDs(identities)
        return splits.filter(function filterFunc(split) {
            return identityOwnerIdlist.filter(function filterFunc(identityOwnerId) {
                if (identityOwnerId === split.value.id.value.ownerID.value.idString) {
                    return split.value.id.value.ownerID.value.idString;
                }
            })
        })
    }

    GetIdentityOwnableId(identities) {
        const ownableIdList = [];
        identities.forEach(function (identity) {
            ownableIdList.push(identity.value.id.value.ownableID.value.idString)
            return ownableIdList;
        })
        return ownableIdList;
    }

    ParseProperties(properties) {
        var propertiesDictionary = {};
        properties.forEach(function (property) {
            propertiesDictionary[property.value.id.value.idString] = property.value.fact.value.hash;
        })
        return propertiesDictionary
    }
}

