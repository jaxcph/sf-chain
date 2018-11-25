const BlockChain = require('../blockchain');
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
const TransactionPool = require('../wallet/transaction-pool');
const P2pServer = require('./p2p-server');

class Miner {
    constructor(blockchain, transactionPool, wallet,p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine(){
        const validTransactions = this.transactionPool.validTransactions();

        // include a reward for the miner
        validTransactions.push(
            Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
        
        // create block consisting of the valid transactations
        const block = this.blockchain.addBlock(validTransactions);

        // synchromoize the chains in the peer-to-peer server
        this.p2pServer.syncChains();

        // clear the transactions
        this.transactionPool.clear();

        // broadcast to every miner to clear their transasction pools
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;