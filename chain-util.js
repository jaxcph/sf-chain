const EC = require('elliptic').ec;
const ec = new EC('sepc256k1');

class ChainUtil {


 static getKeyPair() {
     return ec.genKeyPair();
 }

}

module.exports = ChainUtil;