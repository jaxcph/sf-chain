const Block = require('./block');


describe('Block',() => {
    let data, lastBlock, block;

    beforeEach( ()=> {
        data ='bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock,data);
    });

    it('sets the `data` to match the input', () => { 
        expect(block.data).toEqual(data);
    });

    it('sets the `lastHash` to match hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates a hash that matches the difficulty',() =>{
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.info(block.toString());
    });

    it('lowers the difficulty for slowly mine blocks',() =>{
        expect(Block.adjustDifficulty(block,block.timestamp+36000000))
            .toEqual(block.difficulty -1);
        console.info(block.toString());
    });

    it('raised the difficulty for quickly mine blocks',() =>{
        expect(Block.adjustDifficulty(block,block.timestamp+1))
            .toEqual(block.difficulty +1);
        console.info(block.toString());
    });
});