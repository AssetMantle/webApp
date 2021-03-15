import React from "react";
import base64url from "base64url";
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64'

export default class GetProperty {
    ParseProperties(properties) {
        let propertiesDictionary = {};
        properties.forEach(function (property) {
            propertiesDictionary[property.value.id.value.idString] = property.value.fact.value.hash;
        })
        return propertiesDictionary
    }

    MutablePropertyValues(mutableProperties, inputValues, metaCheckboxList) {
        let mutableValues = "";
        mutableProperties.map((mutableProperty, idx) => {
            if (mutableProperty.name !== "empty") {
                if (metaCheckboxList.length == 0 || !metaCheckboxList.includes(`MutableDataName${idx + 1}`)) {
                    if (inputValues[`MutableDataType${idx + 1}`] === undefined) {
                        inputValues[`MutableDataType${idx + 1}`] = "S|";
                    }
                    if (inputValues[`MutableDataValue${idx + 1}`] === undefined) {
                        inputValues[`MutableDataValue${idx + 1}`] = "";
                    }
                    if (mutableValues !== "") {
                        mutableValues = mutableValues + "," + (inputValues[`MutableDataName${idx + 1}`] + ":" + inputValues[`MutableDataType${idx + 1}`] + inputValues[`MutableDataValue${idx + 1}`]);
                    } else {
                        mutableValues = mutableValues + (inputValues[`MutableDataName${idx + 1}`] + ":" + inputValues[`MutableDataType${idx + 1}`] + inputValues[`MutableDataValue${idx + 1}`]);
                    }
                }
            }
        })
        return mutableValues;
    }

    MutableMetaPropertyValues(mutableMetaProperties, inputValues, metaCheckboxList) {
        let mutableMetaValues = "";
        mutableMetaProperties.map((mutableMetaProperty, idx) => {
            if (mutableMetaProperty.name !== "empty") {
                if (metaCheckboxList.length !== 0 && metaCheckboxList.includes(`MutableDataName${idx + 1}`)) {
                    if (inputValues[`MutableDataType${idx + 1}`] === undefined) {
                        inputValues[`MutableDataType${idx + 1}`] = "S|";
                    }
                    if (inputValues[`MutableDataValue${idx + 1}`] === undefined) {
                        inputValues[`MutableDataValue${idx + 1}`] = "";
                    }

                    if (mutableMetaValues !== "") {
                        mutableMetaValues = mutableMetaValues + "," + (inputValues[`MutableDataName${idx + 1}`] + ":" + inputValues[`MutableDataType${idx + 1}`] + inputValues[`MutableDataValue${idx + 1}`]);
                    } else {
                        mutableMetaValues = mutableMetaValues + (inputValues[`MutableDataName${idx + 1}`] + ":" + inputValues[`MutableDataType${idx + 1}`] + inputValues[`MutableDataValue${idx + 1}`]);
                    }
                }
            }
        })
        return mutableMetaValues;
    }

    ImmutablePropertyValues(immutableProperties, inputValues, ImmutableCheckboxList) {
        let immutableValues = "";
        immutableProperties.map((immutableProperty, idx) => {
            if (immutableProperty.name !== "empty") {
                if (ImmutableCheckboxList.length == 0 || !ImmutableCheckboxList.includes(`ImmutableDataName${idx + 1}`)) {
                    if (inputValues[`ImmutableDataType${idx + 1}`] === undefined) {
                        inputValues[`ImmutableDataType${idx + 1}`] = "S|";
                    }
                    if (inputValues[`ImmutableDataValue${idx + 1}`] === undefined) {
                        inputValues[`ImmutableDataValue${idx + 1}`] = "";
                    }
                    if (immutableValues !== "") {
                        immutableValues = immutableValues + "," + (inputValues[`ImmutableDataName${idx + 1}`] + ":" + inputValues[`ImmutableDataType${idx + 1}`] + inputValues[`ImmutableDataValue${idx + 1}`]);
                    } else {
                        immutableValues = immutableValues + (inputValues[`ImmutableDataName${idx + 1}`] + ":" + inputValues[`ImmutableDataType${idx + 1}`] + inputValues[`ImmutableDataValue${idx + 1}`]);
                    }
                }
            }
        })
        return immutableValues;
    }

    ImmutableMetaPropertyValues(immutableProperties, inputValues, ImmutableCheckboxList) {
        let immutableMetaValues = "";
        immutableProperties.map((immutableProperty, idx) => {
            if (immutableProperty.name !== "empty") {
                if (ImmutableCheckboxList.length !== 0 && ImmutableCheckboxList.includes(`ImmutableDataName${idx + 1}`)) {
                    if (inputValues[`ImmutableDataType${idx + 1}`] === undefined) {
                        inputValues[`ImmutableDataType${idx + 1}`] = "S|";
                    }
                    if (inputValues[`ImmutableDataType${idx + 1}`] === undefined) {
                        inputValues[`ImmutableDataType${idx + 1}`] = "";
                    }
                    if (immutableMetaValues !== "") {
                        immutableMetaValues = immutableMetaValues + "," + (inputValues[`ImmutableDataName${idx + 1}`] + ":" + inputValues[`ImmutableDataType${idx + 1}`] + inputValues[`ImmutableDataValue${idx + 1}`]);
                    } else {
                        immutableMetaValues = immutableMetaValues + (inputValues[`ImmutableDataName${idx + 1}`] + ":" + inputValues[`ImmutableDataType${idx + 1}`] + inputValues[`ImmutableDataValue${idx + 1}`]);
                    }
                }
            }
        })
        return immutableMetaValues;
    }

    getBase64(file) {
        return new Promise(resolve => {
            let baseURL = "";
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };

    getUrlEncode(Url) {
        let UrlEncode;
        if (Url) {
            UrlEncode = base64url.encode(Url) + "=";
        }
        return UrlEncode;
    }

    getBase64Hash(fileData) {
        var pwdHash = sha1(fileData);
        var joinedDataHashB64 = Base64.stringify(pwdHash);
        var finalHash = base64url.fromBase64(joinedDataHashB64) + "="
        return finalHash;
    }

    StringChecking(propertyName) {
        let errorData = false;
        const stringRegEx = /^[a-zA-Z]*$/;
        if (!stringRegEx.test(propertyName)) {
            errorData = false;
        } else {
            errorData = true
        }
        return errorData;
    }

    NumberChecking(propertyName) {
        let errorData = false;
        const numberRegEx = /^[0-9\b]+$/;
        if (!numberRegEx.test(propertyName)) {
            errorData = false;
        } else {
            errorData = true
        }
        return errorData;
    }

    DecimalChecking(propertyName) {
        let errorData = false;
        const DecimalRegEx = /^[-+]?[0-9]+\.[0-9]+$/;
        if (!DecimalRegEx.test(propertyName)) {
            errorData = false;
        } else {
            errorData = true
        }
        return errorData;
    }

    DataTypeValidation(inputValue, propertyName) {
        let $this = this
        let errorData = false;
        if (inputValue === 'S|') {
            errorData = $this.StringChecking(propertyName)
        } else if (inputValue === 'I|') {
            errorData = $this.NumberChecking(propertyName)
        } else if (inputValue === 'H|') {
            errorData = $this.NumberChecking(propertyName)
        } else if (inputValue === 'D|') {
            errorData = $this.DecimalChecking(propertyName)
        }
        return errorData;
    }

    mutableValidation(inputValue) {
        let error = false;
        var blockSpecialRegex = /[`|:]/;
        if (!blockSpecialRegex.test(inputValue)) {
            error = true;
        }
        return error;
    }

    showHideDataTypeError(checkError, id) {
        if (!checkError) {
            document.getElementById(id).classList.remove('none');
            document.getElementById(id).classList.add('show');
        } else {
            if (document.getElementById(id).classList.contains('show')) {
                document.getElementById(id).classList.add('none');
                document.getElementById(id).classList.remove('show');
            }
        }
    }
}
