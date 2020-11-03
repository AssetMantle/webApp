import metaQuery from "persistencejs/transaction/meta/query";
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
        let idList = [];
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
        let identityOwnerIdlist = this.GetIdentityIDs(identities)
        return splits.filter(function filterFunc(split) {
            return identityOwnerIdlist.includes(split.value.id.value.ownerID.value.idString)
        })
    }

    FilterOrdersByIdentity(identities, orders) {
        let identityOwnerIdlist = this.GetIdentityIDs(identities)
        return orders.filter(function filterFunc(order) {
            return identityOwnerIdlist.includes(order.value.id.value.makerID.value.idString)
        })
    }

    FilterMaintainersByIdentity(identities, maintainers) {
        let identityOwnerIdlist = this.GetIdentityIDs(identities)
        return maintainers.filter(function filterFunc(maintainer) {
            return identityOwnerIdlist.includes(maintainer.value.id.value.identityID.value.idString)
        })
    }


    GetIdentityOwnableId(identities) {
        let ownableIdList = [];
        identities.forEach(function (identity) {
            ownableIdList.push(identity.value.id.value.ownableID.value.idString)
            return ownableIdList;
        })
        return ownableIdList;
    }
    
    FetchMetaValue(data , hash){
        var metaValue="";
        if(data.result.value.metas.value.list === null){
            metaValue = hash;
        }else{
            metaValue = data.result.value.metas.value.list[0].value.data.value.value;
        }
        return metaValue;
    }
    
    ParseProperties(properties) {
        let propertiesDictionary = {};
        properties.forEach(function (property) {
            propertiesDictionary[property.value.id.value.idString] = property.value.fact.value.hash;
        })
        return propertiesDictionary
    }
}

