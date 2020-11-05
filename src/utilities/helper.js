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
            idList.push($this.GetIdentityID(identity));
        })
        return idList;
    }

    FilterIdentitiesByProvisionedAddress(identities, address) {
        return identities.filter(function filterFunc(identity) {
            if (identity.value.provisionedAddressList !== null) {
                return identity.value.provisionedAddressList.includes(address)
            }
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

    FetchMetaValue(data, hash) {
        let metaValue = "";
        if (data.result.value.metas.value.list === null) {
            metaValue = hash;
        } else {
            switch (data.result.value.metas.value.list[0].value.data.type) {
                case "xprt/idData":
                    metaValue = data.result.value.metas.value.list[0].value.data.value.value.value.idString;
                    break;
                case "xprt/stringData":
                    metaValue = data.result.value.metas.value.list[0].value.data.value.value;
                    break;
                case "xprt/heightData":
                    metaValue = data.result.value.metas.value.list[0].value.data.value.value.value.height;
                    break;
                case "xprt/decData":
                    metaValue = data.result.value.metas.value.list[0].value.data.value.value;
                    break;
                default :
            }
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

    MutablePropertyValues(mutableProperties, inputValues) {
        let mutableValues = "";
        mutableProperties.map((mutableProperty, idx) => {
            if (idx > 0) {
                mutableValues = mutableValues + "," + (inputValues[`MutableDataName${idx + 1}`] + ":" + inputValues[`MutableDataType${idx + 1}`] + inputValues[`MutableDataValue${idx + 1}`]);
            } else {
                mutableValues = mutableValues + (inputValues[`MutableDataName${idx + 1}`] + ":" + inputValues[`MutableDataType${idx + 1}`] + inputValues[`MutableDataValue${idx + 1}`]);
            }
        })
        return mutableValues;
    }

    MutableMetaPropertyValues(mutableMetaProperties, inputValues) {
        let mutableMetaValues = "";
        mutableMetaProperties.map((mutableMetaProperty, idx) => {
            if (idx > 0) {
                mutableMetaValues = mutableMetaValues + "," + (inputValues[`MutableMetaDataName${idx + 1}`] + ":" + inputValues[`MutableMetaDataType${idx + 1}`] + inputValues[`MutableMetaDataValue${idx + 1}`]);
            } else {
                mutableMetaValues = mutableMetaValues + (inputValues[`MutableMetaDataName${idx + 1}`] + ":" + inputValues[`MutableMetaDataType${idx + 1}`] + inputValues[`MutableMetaDataValue${idx + 1}`]);
            }
        })
        return mutableMetaValues;
    }

    ImmutablePropertyValues(immutableProperties, inputValues) {
        let immutableValues = "";
        immutableProperties.map((immutableProperty, idx) => {
            if (idx > 0) {
                immutableValues = immutableValues + "," + (inputValues[`ImmutableDataName${idx + 1}`] + ":" + inputValues[`ImmutableDataType${idx + 1}`] + inputValues[`ImmutableDataValue${idx + 1}`]);
            } else {
                immutableValues = immutableValues + (inputValues[`ImmutableDataName${idx + 1}`] + ":" + inputValues[`ImmutableDataType${idx + 1}`] + inputValues[`ImmutableDataValue${idx + 1}`]);
            }
        })
        return immutableValues;
    }

    ImmutableMetaPropertyValues(immutableMetaProperties, inputValues) {
        let immutableMetaValues = "";
        immutableMetaProperties.map((immutableMetaProperty, idx) => {
            if (idx > 0) {
                immutableMetaValues = immutableMetaValues + "," + (inputValues[`ImmutableMetaDataName${idx + 1}`] + ":" + inputValues[`ImmutableMetaDataType${idx + 1}`] + inputValues[`ImmutableMetaDataValue${idx + 1}`]);
            } else {
                immutableMetaValues = immutableMetaValues + (inputValues[`ImmutableMetaDataName${idx + 1}`] + ":" + inputValues[`ImmutableMetaDataType${idx + 1}`] + inputValues[`ImmutableMetaDataValue${idx + 1}`]);
            }
        })
        return immutableMetaValues;
    }

    StringChecking(index, inputValues, propertyName) {
        let errorData = false;
        const stringRegEx = /^[a-zA-Z]*$/;
        if (!stringRegEx.test(inputValues[`${propertyName}DataValue${index + 1}`])) {
            errorData = true;
        }
        return errorData;
    }

    NumberChecking(index, inputValues, propertyName) {
        let errorData = false;
        const numberRegEx = /^[0-9\b]+$/;
        if (!numberRegEx.test(inputValues[`${propertyName}DataValue${index + 1}`])) {
            errorData = true;
        }
        return errorData;
    }

    DecimalChecking(index, inputValues, propertyName) {
        let errorData = false;
        const DecimalRegEx = /^[-+]?[0-9]+\.[0-9]+$/;
        if (!DecimalRegEx.test(inputValues[`${propertyName}DataValue${index + 1}`])) {
            errorData = true;
        }
        return errorData;
    }

    DataTypeValidation(index, inputValues, propertyName) {
        let $this = this
        let errorData = false;
        if (inputValues[`${propertyName}DataType${index + 1}`] === 'S|') {
            errorData = $this.StringChecking(index, inputValues, propertyName)
        } else if (inputValues[`${propertyName}DataType${index + 1}`] === 'I|') {
            errorData = $this.NumberChecking(index, inputValues, propertyName)
        } else if (inputValues[`${propertyName}DataType${index + 1}`] === 'H|') {
            errorData = $this.NumberChecking(index, inputValues, propertyName)
        } else if (inputValues[`${propertyName}DataType${index + 1}`] === 'D|') {
            errorData = $this.DecimalChecking(index, inputValues, propertyName)
        }
        return errorData;
    }

    showHideDataTypeError(checkerror, id) {
        if (checkerror) {
            document.getElementById(id).classList.remove('none');
            document.getElementById(id).classList.add('show');
        } else {
            document.getElementById(id).classList.remove('show');
            document.getElementById(id).classList.add('none');
        }
    }
}

