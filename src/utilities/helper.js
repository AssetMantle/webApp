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

    MutablePropertyValues(mutableProperties, inputValues){
        var mutableValues = "";
        mutableProperties.map((shareholder, idx) => {
        if(idx>0){
            mutableValues = mutableValues+","+(inputValues[`MutableDataName${idx+1}`]+":"+inputValues[`MutableDataType${idx+1}`]+inputValues[`MutableDataValue${idx+1}`]);
        }
        else{
            mutableValues = mutableValues+(inputValues[`MutableDataName${idx+1}`]+":"+inputValues[`MutableDataType${idx+1}`]+inputValues[`MutableDataValue${idx+1}`]);
        }
        })
        return mutableValues;
    }
    MutableMetaPropertyValues(mutableMetaProperties, inputValues){
        var mutableMetaValues = "";
        mutableMetaProperties.map((shareholder, idx) => {
        if(idx>0){
            mutableMetaValues = mutableMetaValues+","+(inputValues[`mutableMetaDataName${idx+1}`]+":"+inputValues[`mutableMetaDataType${idx+1}`]+inputValues[`mutableMetaDataValue${idx+1}`]);
        }
        else{
            mutableMetaValues = mutableMetaValues+(inputValues[`mutableMetaDataName${idx+1}`]+":"+inputValues[`mutableMetaDataType${idx+1}`]+inputValues[`mutableMetaDataValue${idx+1}`]);
        }
        })
        return mutableMetaValues;
    }
    ImmutablePropertyValues(immutableProperties, inputValues){
        var immutableValues = "";
        immutableProperties.map((shareholder, idx) => {
            if(idx>0){
                immutableValues = immutableValues+","+(inputValues[`ImmutableDataName${idx+1}`]+":"+inputValues[`ImmutableDataType${idx+1}`]+inputValues[`ImmutableDataValue${idx+1}`]);
            }
            else{
                immutableValues = immutableValues+(inputValues[`ImmutableDataName${idx+1}`]+":"+inputValues[`ImmutableDataType${idx+1}`]+inputValues[`ImmutableDataValue${idx+1}`]);
            }
        })
        return immutableValues;
    }
    ImmutableMetaPropertyValues(immutableMetaProperties, inputValues){
        var immutableMetaValues = "";
        immutableMetaProperties.map((shareholder, idx) => {
            if(idx>0){
                immutableMetaValues = immutableMetaValues+","+(inputValues[`ImmutableMetaDataName${idx+1}`]+":"+inputValues[`ImmutableMetaDataType${idx+1}`]+inputValues[`ImmutableMetaDataValue${idx+1}`]);
            }
            else{
                immutableMetaValues = immutableMetaValues+(inputValues[`ImmutableMetaDataName${idx+1}`]+":"+inputValues[`ImmutableMetaDataType${idx+1}`]+inputValues[`ImmutableMetaDataValue${idx+1}`]);
            }
        })
        return immutableMetaValues;
    }
    
}

