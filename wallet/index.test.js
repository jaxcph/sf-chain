const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const BlockChain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');


 describe('Wallet', () => {
    let wallet, tp, bc ;
    
    beforeEach( ()=> {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new BlockChain();
    });

    describe('creating a transaction', () =>{
       let transaction, sendAmount, recipient;
       beforeEach( () => {
        sendAmount=50;
        recipient='fi3okfedofk2';
        transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
       });

       describe('and during the same transaction', () =>{
        beforeEach( () => {
            wallet.createTransaction(recipient, sendAmount, bc, tp);
        }); 

        it('doubles the `sendAmount` subtracted from the wallet balance', () => {
            expect(transaction.outputs.find( output => output.address === wallet.publicKey ).amount)
            .toEqual(wallet.balance - sendAmount * 2);
        });

        it('clones the `sendAmount` output for the recipient', () => {
            expect(transaction.outputs.filter(output => output.address === recipient)
            .map(output => output.amount))
            .toEqual([sendAmount,sendAmount]);
        });
       });
    });

    describe('calc a balance', ()=> {
        let addBalance, repeatAdd, senderWallet;
        beforeEach( () => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for (let i=0; i<repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey,addBalance,bc, tp);
            }
            bc.addBlock(tp.transactions);
        });

        it('calc the balance for bc txs matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });

        it('calc the balance for bc txs matching the sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });

        describe('and the recipient conducst a transaction', () => {
            let subtractBalance, recipientBalance ;
            beforeEach( () => {

                tp.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey,subtractBalance,bc,tp);
                bc.addBlock(tp.transactions);
            });

            describe('and the sender sends antoher t to the reciepient', () => {
                beforeEach( () =>{
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });

                it('calc the recipient balancfe only using transactions since its most recent one', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });
          
        });
    });
    


 });