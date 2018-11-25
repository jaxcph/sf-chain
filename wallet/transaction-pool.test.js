const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const BlockChain = require('../blockchain');

describe('TransactionPool', () => {
 let tp,wallet,transaction, bc;
 beforeEach( ()=> {
     tp = new TransactionPool();
     wallet = new Wallet();
     bc = new BlockChain();
     transaction = wallet.createTransaction('repaddrfesds02',30,bc,tp);
     
 });

 it('adds a transacation to the pool', () => {
     expect(tp.transactions.find( t => t.id === transaction.id)).toEqual(transaction);
 });


 it('it updates a transacation to the pool', () => {
    
    const oldTransaction =JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet,'dsssss',40);
    tp.updateOrAddTransaction(newTransaction);

    expect(JSON.stringify(tp.transactions.find( t => t.id === newTransaction.id))).not.toEqual(oldTransaction); 
});

it('clears transactions',() => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
});

    describe('mixing valid ad corrupt transactions', () =>{
        let validTransactions;
        beforeEach( ()=> {
            validTransactions = [...tp.transactions];
            for (let i=0; i<6; i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('dsssss',30,bc,tp);
                if(i%2==0) {
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }

            }
        });

        it('shows a difference betwen balid and corrupt transcations', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('it grabs valid transacations', ()=> {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });
    });

});