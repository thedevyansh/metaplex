import { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';

const payer = Keypair.generate();

const secret_array = payer.secretKey
    .toString() 
    .split(',') 
    .map(value => Number(value)); 

const secret = JSON.stringify(secret_array); 

fs.writeFile('payer.json', secret, 'utf8', function (err) {
    if (err) throw err;
    console.log('Wrote secret key to payer.json.');
});

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

(async () => {
    // Payer public key: DmFG7YH5QpiSsac9aQUMkQLwUH14wvtQXCaG8ajayTvc
    const airdropSignature = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);
})()