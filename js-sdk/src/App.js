import React, { useState, useEffect, useRef } from 'react';
import {
  keypairIdentity,
  Metaplex,
  mockStorage,
  useMetaplexFileFromBrowser,
} from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import './App.css';
import kp from './keypair.json';
import { Buffer } from 'buffer';

window.Buffer = Buffer;
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const myKeyPair = Keypair.fromSecretKey(secret);

export default function Home() {
  // console.log(myKeyPair.publicKey.toString());
  const inputRef = useRef();
  const [metadataUri, setMetadataUri] = useState(null);

  useEffect(() => {
    const input = inputRef.current;

    const OnChange = async event => {
      const browserFiles = event.target.files;
      const connection = new Connection(clusterApiUrl('devnet'));
      const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(myKeyPair))
        .use(mockStorage());

      const { uri } = await metaplex.nfts().uploadMetadata({
        name: 'My first ever NFT',
        description: 'This is my first ever NFT',
        image: await useMetaplexFileFromBrowser(browserFiles[0]),
      });

      setMetadataUri(uri);

      const { nft } = await metaplex.nfts().create({
        uri,
      });

      console.log(nft);

      const [myNft] = await metaplex.nfts().findAllByMintList([nft.mint]);
      console.log('MY NFTS', myNft);
    };

    input.addEventListener('change', OnChange);
    return () => input.removeEventListener('change', OnChange);
  }, []);

  return (
    <div className='App'>
      <input ref={inputRef} type='file' id='file-selector' multiple></input>
      {metadataUri && (
        <h3 className='metadata-uri'>
          Metadata URI: {JSON.stringify(metadataUri)}
        </h3>
      )}
    </div>
  );
}
