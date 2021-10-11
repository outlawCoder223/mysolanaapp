const assert = require('assert');
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

describe('mysolanaapp', () => {
  const provider = anchor.Provider.env();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);
  const program = anchor.workspace.Mysolanaapp;

  it('Creates a counter', async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('count 0: ', account.count.toString());
    assert.ok(account.count.toString() === '0');
    _baseAccount = baseAccount;
  });

  it('Increments the counter', async () => {
    const baseAccount = _baseAccount;

    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('Count 1: ', account.count.toString());
    assert.ok(account.count.toString() === '1');
  });

  it('initializes the account', async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.initialize('Hello World', {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('Data: ', account.data);
    assert.ok(account.data === 'Hello World');
    _baseAccount = baseAccount;
  });

  it('updates a previously created account', async () => {
    const baseAccount = _baseAccount;

    await program.rpc.update('Some new data', {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('Updated data: ', account.data);
    assert.ok(account.data === 'Some new data');
    console.log('all account data: ', account);
    console.log('All data: ', account.dataList);
    assert.ok(account.dataList.length === 2);
  });
});
