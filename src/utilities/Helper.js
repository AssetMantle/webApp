import ReactDOM from "react-dom";
import React from "react";
const request = require('request');
import config from "../constants/config.json"

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
        return order.value.id.value.classificationID.value.idString + "*" +
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

    GetIdentityOwnableId(identity) {
        return identity.value.id.value.ownableID.value.idString;
    }

    GetIdentityOwnableIds(identities) {
        let ownableIdList = [];
        let $this = this
        identities.forEach(function (identity) {
            ownableIdList.push($this.GetIdentityOwnableId(identity));
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
            if (inputValues[`MutableDataType${idx + 1}`] === undefined) {
                inputValues[`MutableDataType${idx + 1}`] = "S|";
            }
            if (inputValues[`MutableDataValue${idx + 1}`] === undefined) {
                inputValues[`MutableDataValue${idx + 1}`] = "";
            }
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
            if (inputValues[`MutableMetaDataType${idx + 1}`] === undefined) {
                inputValues[`MutableMetaDataType${idx + 1}`] = "S|";
            }
            if (inputValues[`MutableMetaDataValue${idx + 1}`] === undefined) {
                inputValues[`MutableMetaDataValue${idx + 1}`] = "";
            }
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
            if (inputValues[`ImmutableDataType${idx + 1}`] === undefined) {
                inputValues[`ImmutableDataType${idx + 1}`] = "S|";
            }
            if (inputValues[`ImmutableDataValue${idx + 1}`] === undefined) {
                inputValues[`ImmutableDataValue${idx + 1}`] = "";
            }
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
            if (inputValues[`ImmutableMetaDataType${idx + 1}`] === undefined) {
                inputValues[`ImmutableMetaDataType${idx + 1}`] = "S|";
            }
            if (inputValues[`ImmutableMetaDataValue${idx + 1}`] === undefined) {
                inputValues[`ImmutableMetaDataValue${idx + 1}`] = "";
            }
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

    showHideDataTypeError(checkError, id) {
        if (checkError) {
            document.getElementById(id).classList.remove('none');
            document.getElementById(id).classList.add('show');
        } else {
            document.getElementById(id).classList.remove('show');
            document.getElementById(id).classList.add('none');
        }
    }

    setTraitValues(checkboxMutableNamesList, mutableValues, MetaValues, inputName, mutableName, mutableType, mutableFieldValue) {
        let mutable = ""
        let meta = ""
        if (checkboxMutableNamesList.includes(inputName)) {
            if (MetaValues !== "") {
                meta = MetaValues + "," + mutableName + ":" + mutableType + "|" + mutableFieldValue
            } else {
                meta = MetaValues + mutableName + ":" + mutableType + "|" + mutableFieldValue
            }
        } else {
            if (mutableValues !== "") {
                mutable = mutableValues + "," + mutableName + ":" + mutableType + "|" + mutableFieldValue
            } else {
                mutable = mutableValues + mutableName + ":" + mutableType + "|" + mutableFieldValue
            }
        }
        let result = [mutable, meta]
        return result;
    }


    FetchInputFieldMeta(immutableList, metasQuery, FileName) {
        let $this = this
        if (immutableList !== null) {

            immutableList.map((immutable, index) => {

                const immutableType = immutable.value.fact.value.type;
                const immutableHash = immutable.value.fact.value.hash;
                const immutableName = immutable.value.id.value.idString;
                const id = `${FileName}${immutableName}|${immutableType}${index}`

                if (immutableHash !== "" && immutableHash !== null) {
                    const metaQueryResult = metasQuery.queryMetaWithID(immutableHash);
                    metaQueryResult.then(function (item) {
                        const data = JSON.parse(JSON.parse(JSON.stringify(item)));

                        let metaValue = $this.FetchMetaValue(data, immutableHash)

                        if (document.getElementById(id)) {
                            document.getElementById(id).value = metaValue;
                        }
                    })
                }

            })
        }
    }

    AssignMetaValue(keys,properties, metasQuery, idPrefix, index){
        let $this = this
        keys.map((keyName, index1) => {
            if (properties[keyName] !== "") {
                const metaQueryResult = metasQuery.queryMetaWithID(properties[keyName]);
                metaQueryResult.then(function (item) {
                    const data = JSON.parse(item);
                    let myElement = "";
                    let metaValue = $this.FetchMetaValue(data, properties[keyName])
                    myElement = <span>{metaValue}</span>;
                    ReactDOM.render(myElement, document.getElementById(idPrefix + index + `${index1}`));
                });
            }
        })
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
            const result = await queryTxHash(lcd, txHash)
            return result
        } catch (error) {
            console.log(error)
            console.log("retrying in "+ config.scheduledTxHashQueryDelay +": ", i, "th time")
            await delay(config.scheduledTxHashQueryDelay);
        }
    }
    return JSON.stringify({
        "txhash": txHash,
        "height": 0,
        "code": 111,
        "raw_log": "failed all retries"
    })
}


