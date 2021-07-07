import {Secp256k1HdWallet} from '@cosmjs/amino';
const crypto = require('crypto');
const passwordHashAlgorithm = 'sha512';
const {SigningCosmosClient} = require('@cosmjs/launchpad');
const restAPI = process.env.REACT_APP_API;

function PrivateKeyReader(file, password) {
    return new Promise(function(resolve, reject) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        fileReader.onload = event => {
            const res = JSON.parse(event.target.result);
            const decryptedData = decryptStore(res, password);
            if (decryptedData.error != null) {
                reject(decryptedData.error);
            } else {
                // const wallet = keyUtils.getWallet(decryptedData.mnemonic)
                // console.log(decryptedData.mnemonic, wallet.address, event.target.result,'whole data')
                resolve(decryptedData.mnemonic);
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
    const cosmJS = new SigningCosmosClient(restAPI, signerAddress, wallet);
    return await cosmJS.signAndBroadcast(msgs, fee, memo);
}

async function TransactionWithMnemonic(msgs, fee, memo, mnemonic) {
    const [wallet, address] = await MnemonicWalletWithPassphrase(mnemonic);
    return await Transaction(wallet, address, msgs, fee, memo);
}

async function MnemonicWalletWithPassphrase(mnemonic) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic);
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];
}

async function TransactionWithKeplr(msgs, fee, memo, chainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSigner(chainID);
    const accounts = await offlineSigner.getAccounts();
    const cosmJS = new SigningCosmosClient(restAPI, accounts[0].address, offlineSigner );
    return await cosmJS.signAndBroadcast(msgs, fee, memo);
}

export default {
    PrivateKeyReader,
    createStore,
    decryptStore,
    Transaction,
    TransactionWithMnemonic,
    TransactionWithKeplr
};
