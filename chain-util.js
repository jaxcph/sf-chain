const SHA265 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1');


const ec = new EC('secp256k1');


class ChainUtil {


    static getKeyPair() {
        return ec.genKeyPair();
    }

    static id(){
        return uuidV1();
    }

    static hash(data){
        return SHA265(JSON.stringify(data)).toString();
    }
    
    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey,'hex').verify(dataHash,signature);
    }
}

module.exports = ChainUtil;