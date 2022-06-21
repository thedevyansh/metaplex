const fs = require('fs')
const {Keypair} = require('@solana/web3.js')

const keypairFile = fs.readFileSync('/Users/devyansh/.config/solana/id.json');
const keypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(keypairFile.toString()))
  );

fs.writeFileSync('./keypair.json', JSON.stringify(keypair))