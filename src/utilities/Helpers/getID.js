import ReactDOM from "react-dom";
import React from "react";
import base64url from "base64url";
const request = require('request');
import config from "../constants/config.json"
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64'

export default class GetID {
    GetClassificationID(data) {
        return data.value.id.value.classificationID.value.idString;
    }

    GetIdentityID(identity) {
        return identity.value.id.value.classificationID.value.idString + "|" +
            identity.value.id.value.hashID.value.idString
    }

    GetAssetID(asset) {
        return asset.value.id.value.classificationID.value.idString + "|" +
            asset.value.id.value.hashID.value.idString
    }

    GetMakerOwnableID(data) {
        return data.value.id.value.makerOwnableID.value.idString;
    }

    GetTakerOwnableID(data) {
        return data.value.id.value.takerOwnableID.value.idString;
    }

    GetMakerID(data) {
        return data.value.id.value.makerID.value.idString;
    }

    GetHashID(data) {
        return data.value.id.value.hashID.value.idString;
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
}
