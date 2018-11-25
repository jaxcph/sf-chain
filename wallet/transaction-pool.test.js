const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');


describe('TransactionPool', () => {
 let tp,wallet,transaction;
 beforeEach( ()=> {
     tp = new TransactionPool();
     wallet = new Wallet();
     transaction = Transaction.newTransaction(wallet,'repaddrfesds02',30);
     tp.updateOrAddTransaction(transaction);
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

});