const BlockChain = require('./blockchain');
const Block = require('./block');

describe('BlockChain',() => {
    let bc;

    beforeEach( ()=> {
        bc = new BlockChain();
    });

    it('starts with the genesis block', () => { 
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

});