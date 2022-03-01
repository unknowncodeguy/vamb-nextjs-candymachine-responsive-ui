import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from 'next/image';
import * as anchor from "@project-serum/anchor";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { SolanaClient, SolanaClientProps } from '../helpers/sol';
import Link from 'next/link'
import { RootState } from "../redux/store";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setIsOwner, setTheme } from "../redux/slices/counterSlice";
import styles from'./index.module.scss'
import { ALLOWED_NFT_NAME, UPDATEAUTHORITY_ADDRESS } from "../config/prod";
import logo from '../public/icon.png'
import { useRouter } from 'next/router'
import {getAllCollectionsAndCheckWallet} from '../utils/connection'
import { Connection } from "@solana/web3.js";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
    },
    signin: {
      background: theme.palette.background.paper
    },
    buyNow: {
      marginTop: `8px`
    }
  })
)

const Wallet = function (props: any) {
  const { children, className } = props;
  const wallet = useAnchorWallet();
  const router = useRouter()
  const classes = useStyles(props)
  const [isLoading, setIsLoading] = useState(false);
  const isOwner = useAppSelector((state: RootState) => state.isOwner.value);
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);

  const dispatch = useAppDispatch();
  const getNftsFromWallet = async () => {
    const pubKey = wallet?.publicKey?.toString() || '';
    setIsLoading(true)
    try {
      const solanaClient = new SolanaClient({ rpcEndpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_HOST } as SolanaClientProps);
      let result = await solanaClient.getAllCollectibles([pubKey], [{ updateAuthority: UPDATEAUTHORITY_ADDRESS, collectionName: ALLOWED_NFT_NAME }])
      setIsLoading(false)
      if (result[pubKey].length) {
        dispatch(setIsOwner(true));
        dispatch(setTheme('true'));
      }
    } catch(err) {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    (async () => {
      if (wallet) {
        await getNftsFromWallet();
      }
      
      else {
        dispatch(setIsOwner(false))
        setIsLoading(false);
      }
    })();
  }, [wallet, props.connection]);
  useEffect(()=> {
    router.push(isOwner?"/mint":"/")
  }, [isOwner])
  return (
    <main className={`${classes.root}`}>
      <Head>
        <title> Signin with Wallet </title>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>

      <div className={`d-flex align-items-center justify-content-center ${styles.wrapper}`}>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <div className={`text-center ${styles.signin} ${classes.signin}`}>
              <div className={`${styles.logo}`}>
              <Image
                src={logo}
                alt="Logo image of site"
              />
              </div>
              <div >
                <Typography variant="h6" className={`${styles.title}`}>
                  {`VAMB`}
                </Typography>
                <Typography variant="h5" className={`${styles.subTitle}`}>
                  {`WELCOME TO VAMB`}
                </Typography>
                <Typography variant="body1" className={`${styles.description}`}>
                  {`Please connect you're wallet to start using our tool`}
                </Typography>
              </div>

              <div className={`d-flex align-items-center justify-content-center ${styles.walletButton}`}>
                {
                  isLoading ? <CircularProgress className="modal_progress" />:<WalletMultiButton />
                }
                
              </div>

              <div>
                <Typography variant="body2" className={`d-flex align-items-center justify-content-center ${classes.buyNow}`}>
                  {`Don’t have VAMB? `} 
                  <Button className={`${styles.buyNow}`}>Buy Now</Button>
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item md={4}></Grid>
        </Grid>
      </div>
    </main>
  )
}

export default Wallet;
