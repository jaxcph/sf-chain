const Wallet = require('./wallet');

const wallet = new Wallet();

console.log(wallet.toString());

/*const Blockchain = require('./blockchain');
const bc = new Blockchain();

const b=Date.now();

for (let i=0; i<10; i++) {
    console.log(bc.addBlock(`foo ${i}`).toString());
}

const e=Date.now();
console.info('avg duration', (e-b)/10); */