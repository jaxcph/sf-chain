const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction',()=>{
    let transaction, wallet, recipient, amount;

    beforeEach( () => {
        wallet = new Wallet();
        amount = 50;
        recipient ='recipien-address-hex';
        transaction = Transaction.newTransaction(wallet,recipient,amount);
    });

    it('output the `amount` substracted from the wallet balance', () => {
        expect(transaction.outputs.find( output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it('output the `amount` added from the receipient balance', () => {
        expect(transaction.outputs.find( output => output.address === recipient).amount).toEqual(amount);
    });

    it('inputes the balance of the wallet',  () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', ()=> {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('in-validates a corupt transaction', ()=> {
        transaction.outputs[0].amount=999999
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });


    describe('tranactkion with an amount the exceeds the balance', () => {
        beforeEach( ()=> {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        } );

        it('does not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('add updating a transaction', () => {
        let nextAmount, nextRecipient;

        beforeEach( ()=> {

            nextAmount = 20;
            nextRecipient='rept 02 address';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('subtracts the next amount from the senders output', () => {
            expect(transaction.outputs.find( output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find( output => output.address === nextRecipient).amount).toEqual(nextAmount);
        });
    });



} );