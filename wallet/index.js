const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');
const BlockChain = require('../blockchain');
class Wallet {

    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.getKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');

     }


     toString() {
        return `Wallet - 
        publicKey: ${this.publicKey.toString()}
        balance: ${this.balance}`;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool){
        this.balance = this.calculateBalance(blockchain);

        if( amount > this.balance) {
            console.error(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);
        if(transaction) {
            transaction.update(this, recipient, amount);
        } else  {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }


    calculateBalance(blockchain) {
        let balance = this.balance;
        let txs = [];

        blockchain.chain.forEach(block => block.data.forEach(tx => {   txs.push(tx);  }));
        const walletInputTs = txs.filter( t => t.input.address === this.publicKey);

        let startTime = 0;
        if(walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current);
            balance = recentInputT.outputs.find( o => o.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }

        txs.forEach( t => {
            if (t.input.timestamp > startTime){
                t.outputs.find( o => {
                    if(o.address === this.publicKey) {
                        balance+= o.amount;
                    }
                });
            }
        });

        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address='blockchain-wallet';
        return blockchainWallet;
    }

   
}

module.exports = Wallet;