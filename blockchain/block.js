const SHA265 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config');


class Block  {

    constructor(timestamp, lastHash, hash, data, nonce, difficulty,timeToMined) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
        this.timeToMined = timeToMined;
    }

    toString() {
        return `Block -
        Timestamp  : ${this.timestamp}
        Last Hash  : ${this.lastHash}
        Hash       : ${this.hash}
        Nonce      : ${this.nonce}
        Difficulty : ${this.difficulty}
        TimeToMined: ${this.timeToMined} msec
        Data       : ${this.data}`;
    }

    static genesis() {
        return new this(0,'0x','GENESIS',[],0,DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
       
        const lastHash = lastBlock.hash;
        let timestamp;
        let hash;
        let nonce = 0;
        let { difficulty}  = lastBlock; //get from lastBlock
    
        const b = Date.now();

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock,timestamp);
            hash = Block.hash(timestamp,lastHash,data, nonce,difficulty);
        } while (hash.substring(0, difficulty) !=='0'.repeat(difficulty));

        return new this(timestamp,lastHash,hash,data,nonce,difficulty,(Date.now()-b));
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return SHA265(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty} = block; //grab from block
        return Block.hash(timestamp, lastHash, data, nonce,difficulty);
    }
    
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ?
                     difficulty + 1: difficulty - 1;

        return difficulty;
    }

}

module.exports = Block;