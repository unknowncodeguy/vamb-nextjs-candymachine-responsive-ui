import * as anchor from "@project-serum/anchor";

import { SystemProgram,Transaction } from '@solana/web3.js';
import { sendTransactions, getUnixTs } from './connection';
import {
  MAGICEDEN_API,
} from "../config/prod"

import axios from "axios";

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const quickOneBuy = async (listedInfo: any, walletAddr: any, provider: any) => {

  const q = `buyer=${walletAddr.toString()}&seller=${listedInfo.owner}&auctionHouseAddress=${listedInfo.v2.auctionHouseKey}&tokenMint=${listedInfo.mintAddress}&tokenATA=${listedInfo.id}&price=${listedInfo.price}&sellerReferral=${listedInfo.v2.sellerReferral}&sellerExpiry=${listedInfo.v2.expiry}`;

  let tx = await axios({
    method: 'get',
    url: `https://magiceden.boogle-cors.workers.dev`,
    params: {
      u:MAGICEDEN_API.BUY_V2 + q
    }
  });
  console.log(tx)
  let s = await provider.send(anchor.web3.Transaction.populate(anchor.web3.Message.from(Buffer.from(tx.data.tx.data))));
  await provider.connection.confirmTransaction(s)
  console.log(s)
}
export const quickMultiBuy = async (items: any, walletAddr: any, provider: any) => {
  console.log(items)
  try {
    let txsMatrix: Transaction[] = [];
    for(let i=0; i< items.length; i++) {
      const q = `buyer=${walletAddr.toString()}&seller=${items[i].owner}&auctionHouseAddress=${items[i].v2.auctionHouseKey}&tokenMint=${items[i].mintAddress}&tokenATA=${items[i].id}&price=${items[i].price}&sellerReferral=${items[i].v2.sellerReferral}&sellerExpiry=${items[i].v2.expiry}`;

      let decodedTx = await axios({
        method: 'get',
        url: `${MAGICEDEN_API.BUY_V2}${q}`
       
      });
      let tx = anchor.web3.Transaction.populate(anchor.web3.Message.from(decodedTx.data.tx.data));
      console.log(anchor.web3.Message.from(decodedTx.data.tx.data))
      txsMatrix.push(tx);
    }  
    let block = await provider.connection.getRecentBlockhash('singleGossip');
    for(let i=0; i< items.length; i++) {
      txsMatrix[i].recentBlockhash = block.blockhash
      txsMatrix[i].setSigners(
        // fee payed by the wallet owner
        provider.wallet.publicKey
      );
    }

    console.log(txsMatrix)
    const signedTxns = await provider.wallet.signAllTransactions(txsMatrix);
    console.log(signedTxns)
    const txsId: any[] = [];
    for(let i = 0; i < signedTxns.length; i++) {
      const sendTx = signedTxns[i].serialize({verifySignatures: !1});
      const startTime = getUnixTs();
        let slot = 0;
        const txid: any = await provider.connection.sendRawTransaction(
          sendTx,
          {
            skipPreflight: true,
          },
        );
        txsId.push(txid)
        console.log('Started awaiting confirmation for', txid);
      
        let done = false;
        (async () => {
          while (!done && getUnixTs() - startTime < 15000) {
            provider.connection.sendRawTransaction(sendTx, {
              skipPreflight: true,
            });
            await sleep(500);
          }
        })();
    }
    console.log(txsId);
  } catch(err) {
    console.log(err)
  }
  

}