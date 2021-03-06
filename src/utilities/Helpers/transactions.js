import {Secp256k1HdWallet} from '@cosmjs/amino';
import {stringToPath} from "@cosmjs/crypto";
import config from "../../config";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {LedgerSigner} from "@cosmjs/ledger-amino";
import {GasPrice} from "@cosmjs/launchpad";

const crypto = require('crypto');
const passwordHashAlgorithm = 'sha512';
const {SigningCosmosClient} = require('@cosmjs/launchpad');
const restAPI = process.env.REACT_APP_ASSET_MANTLE_API;
const prefix = config.addressPrefix;
const bip39 = require("bip39");


function PrivateKeyReader(file, password) {
    return new Promise(function (resolve, reject) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        fileReader.onload = event => {
            const res = JSON.parse(event.target.result);
            const decryptedData = decryptStore(res, password);

            if (decryptedData.error != null) {
                reject(decryptedData.error);
            } else {
                let mnemonic = mnemonicTrim(decryptedData.mnemonic);
                resolve(mnemonic);
                localStorage.setItem('encryptedMnemonic', event.target.result);
            }
        };
    });
}

function createStore(mnemonic, password) {
    try {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(mnemonic);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        let obj = {
            'hashpwd': crypto.createHash(passwordHashAlgorithm).update(password).digest('hex'),
            'iv': iv.toString('hex'),
            'salt': key.toString('hex'),
            'crypted': encrypted.toString('hex'),
        };
        return {
            Response: obj,
        };
    } catch (exception) {
        return {
            success: false,
            error: exception.message,
        };
    }
}

function decryptStore(fileData, password) {
    let hashpwd = fileData.hashpwd;
    let iv = fileData.iv;
    let salt = fileData.salt;
    let crypted = fileData.crypted;

    if (hashpwd === crypto.createHash(passwordHashAlgorithm).update(password).digest('hex')) {
        let ivText = Buffer.from(iv, 'hex');
        let encryptedText = Buffer.from(crypted, 'hex');

        let decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(salt, 'hex'),
            ivText,
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return {
            mnemonic: decrypted.toString(),
        };
    } else {
        return {
            error: 'Incorrect password.',
        };
    }
}

async function Transaction(wallet, signerAddress, msgs, fee, memo = '') {
    const cosmJS = new SigningCosmosClient(restAPI, signerAddress, wallet, GasPrice.fromString("0" + config.coinDenom), {}, config.mode);
    return await cosmJS.signAndBroadcast(msgs, fee, memo);
}

async function MnemonicWallet() {
    const wallet = await Secp256k1HdWallet.generate(24, {prefix: prefix, hdPaths: [stringToPath("m/44'/118'/0'/0/0")]});
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];
}


async function TransactionWithMnemonic(msgs, fee, memo, mnemonic, type) {

    if (type === "normal") {
        const [wallet, address] = await MnemonicWalletWithPassphrase(mnemonic, '');
        return await Transaction(wallet, address, msgs, fee, memo);
    } else {
        let accountNumber = localStorage.getItem('accountNumber') * 1;
        let addressIndex = localStorage.getItem('addressIndex') * 1;
        const [wallet, address] = await LedgerWallet(makeHdPath(accountNumber, addressIndex), "mantle");
        return await Transaction(wallet, address, msgs, fee, memo);
    }
}


async function LedgerWallet(hdpath, prefix) {
    const interactiveTimeout = 120_000;

    async function createTransport() {
        const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);
        return ledgerTransport;
    }

    const transport = await createTransport();
    const signer = new LedgerSigner(transport, {
        testModeAllowed: true,
        hdPaths: [hdpath],
        prefix: prefix
    });
    const [firstAccount] = await signer.getAccounts();
    return [signer, firstAccount.address];
}


async function MnemonicWalletWithPassphrase(mnemonic, passphrase) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: config.addressPrefix,
        bip39Password: passphrase,
        hdPaths: [stringToPath("m/44'/118'/0'/0/0")]
    });
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];
}

async function TransactionWithKeplr(msgs, fee, memo, chainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSigner(chainID);
    const accounts = await offlineSigner.getAccounts();
    const cosmJS = new SigningCosmosClient(restAPI, accounts[0].address, offlineSigner, GasPrice.fromString("0" + config.coinDenom), {}, config.mode);
    return await cosmJS.signAndBroadcast(msgs, fee, memo);
}

function mnemonicTrim(mnemonic) {
    let mnemonicList = mnemonic.replace(/\s/g, " ").split(/\s/g);
    let mnemonicWords = [];
    for (let word of mnemonicList) {
        if (word === "") {
            console.log();
        } else {
            let trimmedWord = word.replace(/\s/g, "");
            mnemonicWords.push(trimmedWord);
        }
    }
    mnemonicWords = mnemonicWords.join(" ");
    return mnemonicWords;
}

function makeHdPath(accountNumber = "0", addressIndex = "0", coinType = config.coinType) {
    return stringToPath("m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex);
}


function mnemonicValidation(memo) {
    const mnemonicWords = mnemonicTrim(memo).toString();
    let validateMnemonic = bip39.validateMnemonic(mnemonicWords);
    return validateMnemonic;
}

export default {
    PrivateKeyReader,
    createStore,
    decryptStore,
    Transaction,
    TransactionWithMnemonic,
    TransactionWithKeplr,
    mnemonicValidation,
    mnemonicTrim,
    makeHdPath,
    MnemonicWallet,
    MnemonicWalletWithPassphrase
};
