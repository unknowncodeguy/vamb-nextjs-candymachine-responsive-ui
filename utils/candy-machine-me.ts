import * as anchor from "@project-serum/anchor";
import * as bs58 from "bs58";
import {
  MintLayout,
  TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import { SystemProgram } from '@solana/web3.js';
import { sendTransactions, getUnixTs } from './connection';

import {

  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
} from './utils';
import axios from "axios";

export const CANDY_MACHINE_PROGRAM_ME = new anchor.web3.PublicKey(
  "CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb"
);

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const WRAPPED_SOL_ADDRESS = new anchor.web3.PublicKey(
  "So11111111111111111111111111111111111111112"
);

const notaryUrl = "https://wk-notary-prod.magiceden.io/sign"

const NOTARY_PUBLICKEY = new anchor.web3.PublicKey(
  "71R43w8efa2H6T3pQR7Hif8nj5A3ow2bnx6dAzYJBffP"
);

const MEMO_PROGRAM = new anchor.web3.PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

const MEMO_DATA = "2EE2Hhoe8fVAYn7J5qwuayNmrEgmTPskLyszojv"
export interface CandyMachineME {
  id: anchor.web3.PublicKey,
  program: anchor.Program;
  state: CandyMachineState;
}

interface CandyMachineState {
  config: anchor.web3.PublicKey;
  notary: anchor.web3.PublicKey;
  itemsAvailable: number;
  itemsRedeemed: number;
  itemsRemaining: number;
  treasury: anchor.web3.PublicKey;
  tokenMint: anchor.web3.PublicKey;
  isSoldOut: boolean;
  itemsRedeemedRaffle: number,
  bump: number,
  authority:  anchor.web3.PublicKey,
  raffleSeed: number,
  raffleTicketsPurchased: number
}

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  timeout: number,
  connection: anchor.web3.Connection,
  commitment: anchor.web3.Commitment = 'recent',
  queryStatus = false,
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let done = false;
  let status: anchor.web3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  let subId = 0;
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return;
      }
      done = true;
      console.log('Rejecting for timeout...');
      reject({ timeout: true });
    }, timeout);
    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);
          status = signatureStatuses && signatureStatuses.value[0];
          if (!done) {
            if (!status) {
              console.log('REST null result for', txid, status);
            } else if (status.err) {
              console.log('REST error for', txid, status);
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              console.log('REST no confirmations for', txid, status);
            } else {
              console.log('REST confirmation for', txid, status);
              done = true;
              resolve(status);
            }
          }
        } catch (e) {
          if (!done) {
            console.log('REST connection error: txid', txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  //@ts-ignore
  if (connection._signatureSubscriptions[subId]) {
    connection.removeSignatureListener(subId);
  }
  done = true;
  console.log('Returning status', status);
  return status;
};

/* export */ const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey,
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
};
export function fromUTF8Array(data: number[]) {
  // array of bytes
  let str = '', i;

  for (i = 0; i < data.length; i++) {
    const value = data[i];

    if (value < 0x80) {
      str += String.fromCharCode(value);
    } else if (value > 0xbf && value < 0xe0) {
      str += String.fromCharCode(((value & 0x1f) << 6) | (data[i + 1] & 0x3f));
      i += 1;
    } else if (value > 0xdf && value < 0xf0) {
      str += String.fromCharCode(
        ((value & 0x0f) << 12) |
          ((data[i + 1] & 0x3f) << 6) |
          (data[i + 2] & 0x3f),
      );
      i += 2;
    } else {
      // surrogate pair
      const charCode =
        (((value & 0x07) << 18) |
          ((data[i + 1] & 0x3f) << 12) |
          ((data[i + 2] & 0x3f) << 6) |
          (data[i + 3] & 0x3f)) -
        0x010000;

      str += String.fromCharCode(
        (charCode >> 10) | 0xd800,
        (charCode & 0x03ff) | 0xdc00,
      );
      i += 3;
    }
  }

  return str;
}
export const getCandyMachineMEState = async (
  anchorWallet: anchor.Wallet,
  candyMachineId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection,
): Promise<CandyMachineME> => {
  const provider = new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: 'recent',
  });
  const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM_ME, provider);
  console.log(idl);
  const program = new anchor.Program(idl, CANDY_MACHINE_PROGRAM_ME, provider);
  console.log(idl)
  const state: any = await program.account.candyMachine.fetch(candyMachineId);  
  console.log(state);
  const itemsAvailable = state.itemsAvailable.toNumber();
  const itemsRedeemed = state.itemsRedeemedNormal.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;

  return {
    id: candyMachineId,
    program,
    state:  {
      config: state.config,
      notary: state.notary ? state.notary : SystemProgram.programId,
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      itemsRedeemedRaffle: state.itemsRedeemedRaffle.toNumber(),
      isSoldOut: itemsRemaining === 0,
      treasury: state.wallet,
      tokenMint: state.tokenMint,
      bump: state.bump,
      authority: state.authority,
      raffleSeed: state.raffleSeed,
      raffleTicketsPurchased: state.raffleTicketsPurchased
    }
  };
};

const getMasterEdition = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

const getMetadata = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

const getTokenWallet = async (
  wallet: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey
) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
};
export const getWalletLimitInfo = async (
  candyMachineId: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode('wallet_limit'), candyMachineId.toBuffer(),payer.toBuffer()],
    CANDY_MACHINE_PROGRAM_ME
  );
};
const getLaunchStagesInfo = async (cndyId: anchor.web3.PublicKey): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode('candy_machine'), anchor.utils.bytes.utf8.encode('launch_stages'),cndyId.toBuffer()],
    CANDY_MACHINE_PROGRAM_ME
  );
}
export const mintOneMEToken = async (
  candyMachine: CandyMachineME,
  payer: anchor.web3.PublicKey,
): Promise<string> => {
  const mint = anchor.web3.Keypair.generate();
  const token = await getTokenWallet(payer, mint.publicKey);
  const { program } = candyMachine;
  const metadata = await getMetadata(mint.publicKey);
  const masterEdition = await getMasterEdition(mint.publicKey);

  const rent = await program.provider.connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );
  const [launchStagesInfo, launchStagesBump] = await getLaunchStagesInfo(candyMachine.id)
  const [walletLimitInfo, walletLimitBump] = await getWalletLimitInfo(
    candyMachine.id, payer
  );
  console.log("walletLimitInfo", walletLimitInfo.toString())
  
  const tx = program.transaction.mintNft(walletLimitBump ,{
    accounts: {
      config: candyMachine.state.config,
      candyMachine: candyMachine.id,
      payer: payer,
      launchStagesInfo: launchStagesInfo,
      wallet: candyMachine.state.treasury,
      mint: mint.publicKey,
      metadata,
      masterEdition,
      walletLimitInfo: walletLimitInfo,
      mintAuthority: payer,
      updateAuthority: payer,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    },
    signers: [mint],
    remainingAccounts: [{
        pubkey: WRAPPED_SOL_ADDRESS,
        isWritable: true,
        isSigner: false
    }, {
        pubkey: payer,
        isWritable: false,
        isSigner: false
    },{
        pubkey: new anchor.web3.PublicKey("71R43w8efa2H6T3pQR7Hif8nj5A3ow2bnx6dAzYJBffP") || anchor.web3.SystemProgram.programId,
        isWritable: false,
        isSigner: true
    }],
    instructions: [
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports: rent,
        programId: TOKEN_PROGRAM_ID,
      }),
      
      // new anchor.web3.TransactionInstruction({
      //   keys: a,
      //   programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      //   data: Buffer.from([]),
      // }),
      new anchor.web3.TransactionInstruction({
        programId: new anchor.web3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: Buffer.from(bs58.encode(Buffer.from("we live to fight another day"))),
        keys: []
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0,
        payer,
        payer
      ),
      createAssociatedTokenAccountInstruction(
        token,
        payer,
        payer,
        mint.publicKey
      ),
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        token,
        payer,
        [],
        1
      ),
    ],
  });
  const blockhash = await program.provider.connection.getRecentBlockhash("finalized");
  tx.recentBlockhash = blockhash.blockhash;
  tx.feePayer = payer;
 
  const notaryResult = await axios({
    method: 'POST',
    url: `https://angle.boogle-cors.workers.dev/?u=https://wk-notary-prod.magiceden.io/sign`,
    data: {
      response: MEMO_DATA,
      message: bs58.encode(tx.serializeMessage()),
    }
  });
  await program.provider.wallet.signTransaction(tx)
  tx.partialSign(mint)
  tx.addSignature(new anchor.web3.PublicKey('71R43w8efa2H6T3pQR7Hif8nj5A3ow2bnx6dAzYJBffP'), bs58.decode(notaryResult.data.signature))
  console.log(tx);
  const sendTx = tx.serialize({verifySignatures: !1});

  return await program.provider.connection.sendRawTransaction(sendTx);
}

export const mintMultipleMEToken = async (
  candyMachine: CandyMachineME,
  config: anchor.web3.PublicKey, // feels like this should be part of candyMachine?
  payer: anchor.web3.PublicKey,
  treasury: anchor.web3.PublicKey,
  quantity: number = 2
): Promise<(string | undefined)[]> => {

  console.log("multipleMint", quantity);
  const signersMatrix: any = [];
  const txsMatrix = [];
  const { program } = candyMachine;
  const [walletLimitInfo, walletLimitBump] = await getWalletLimitInfo(
    candyMachine.id, payer
  );
  const rent = await program.provider.connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );

  for(let index = 0; index < quantity; index++) {
    const mint = anchor.web3.Keypair.generate();
    const token = await getTokenWallet(payer, mint.publicKey);
    const metadata = await getMetadata(mint.publicKey);
    const masterEdition = await getMasterEdition(mint.publicKey);
    const tx = program.transaction.mintNft(walletLimitBump ,{
      accounts: {
        config,
        candyMachine: candyMachine.id,
        payer: payer,
        wallet: treasury,
        mint: mint.publicKey,
        metadata,
        masterEdition,
        walletLimitInfo: walletLimitInfo,
        mintAuthority: payer,
        updateAuthority: payer,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      },
      signers: [mint],
      remainingAccounts: [{
          pubkey: WRAPPED_SOL_ADDRESS,
          isWritable: true,
          isSigner: false
      }, {
          pubkey: payer,
          isWritable: false,
          isSigner: false
      },{
          pubkey: NOTARY_PUBLICKEY,
          isWritable: false,
          isSigner: true
      }],
      instructions: [
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: mint.publicKey,
          space: MintLayout.span,
          lamports: rent,
          programId: TOKEN_PROGRAM_ID,
        }),
        Token.createInitMintInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          0,
          payer,
          payer
        ),
        new anchor.web3.TransactionInstruction({
          programId: MEMO_PROGRAM,
          data: Buffer.from(MEMO_DATA),
          keys: []
        }),
        createAssociatedTokenAccountInstruction(
          token,
          payer,
          payer,
          mint.publicKey
        ),
        Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          token,
          payer,
          [],
          1
        ),
      ],
    });
    const blockhash = await program.provider.connection.getRecentBlockhash("finalized");
    tx.recentBlockhash = blockhash.blockhash;
    tx.feePayer = payer
    const notaryResult = await axios.post(notaryUrl, {
      response: MEMO_DATA,
      message: bs58.encode(tx.serializeMessage())
    });
    tx.partialSign(mint)
    tx.addSignature(NOTARY_PUBLICKEY, bs58.decode(notaryResult.data.signature))
    console.log(tx);
    txsMatrix.push(tx);
  }
  console.log(txsMatrix);
  const signedTxns = await program.provider.wallet.signAllTransactions(txsMatrix)
  const txsId: any[] = [];
  for(let i = 0; i < signedTxns.length; i++) {
    const sendTx = signedTxns[i].serialize({verifySignatures: !1});
    const startTime = getUnixTs();
      let slot = 0;
      const txid: any = await program.provider.connection.sendRawTransaction(
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
          program.provider.connection.sendRawTransaction(sendTx, {
            skipPreflight: true,
          });
          await sleep(500);
        }
      })();
  }

  return txsId;
};
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}