const Block = require('./block');


console.log(Block.genesis());
const fooBlock = Block.mineBlock(Block.genesis(),'foo');
console.log(fooBlock.toString());