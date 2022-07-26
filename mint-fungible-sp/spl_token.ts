import { createMint, getMint, getOrCreateAssociatedTokenAccount, getAccount, mintTo, AccountLayout, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, NATIVE_MINT, createAssociatedTokenAccountInstruction, transfer } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import payerSecret from './keys/payer.json';
import mintAuthoritySecret from './keys/mintAuthority.json';
import freezeAuthoritySecret from './keys/freezeAuthority.json';

const payer = Keypair.fromSecretKey(new Uint8Array(payerSecret));
const mintAuthority = Keypair.fromSecretKey(new Uint8Array(mintAuthoritySecret));
const freezeAuthority = Keypair.fromSecretKey(new Uint8Array(freezeAuthoritySecret));

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

async function createAndInitializeMint() {
    // create and initialize the mint
    const mint = await createMint(connection, payer, mintAuthority.publicKey, freezeAuthority.publicKey, 9);
    console.log(`Mint created: ${mint.toBase58()}`);

    // get mint info
    let mintInfo = await getMint(connection, mint);
    console.log(`Mint supply: ${mintInfo.supply}`);

    // get or create an account associated with the mint
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
    console.log(`Token account created: ${tokenAccount.address.toBase58()}`);

    // get account info
    let tokenAccountInfo = await getAccount(connection, tokenAccount.address);
    console.log(`Token account balance: ${tokenAccountInfo.amount}`);

    // mint 100 tokens into the account
    // because decimals for the mint are set to 9, the amount is 100 * 10^9
    await mintTo(connection, payer, mint, tokenAccount.address, mintAuthority, 100000000000)

    // get mint info again
    mintInfo = await getMint(connection, mint);
    console.log(`Mint supply: ${mintInfo.supply}`);

    // get account info again
    tokenAccountInfo = await getAccount(connection, tokenAccount.address);
    console.log(`Token account balance: ${tokenAccountInfo.amount}`);
}

(async () => {
    // await createAndInitializeMint();

    const tokenAccounts = await connection.getTokenAccountsByOwner(
        payer.publicKey,
        {
            programId: TOKEN_PROGRAM_ID,
        }
    );

    console.log("Token                                         Balance");
    console.log("------------------------------------------------------------");
    tokenAccounts.value.forEach((e) => {
        const accountInfo = AccountLayout.decode(e.account.data);
        console.log(`${new PublicKey(accountInfo.mint)}   ${accountInfo.amount}`);
    })

})();
