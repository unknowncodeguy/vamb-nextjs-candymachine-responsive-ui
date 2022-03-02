import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from 'next/image';
import * as anchor from "@project-serum/anchor";
import Snackbar from '@material-ui/core/Snackbar'

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import { CUSTOM_RPC_KEY, DEFAULT_RPC_API } from "../config/prod";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Alert from '@material-ui/lab/Alert';

import styles from'./index.module.scss'
import logo from '../public/icon.png'
import { useRouter } from 'next/router'
import { getNFTOwner, AlertState } from "../utils/utils";
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
  const wallet = useAnchorWallet();
  const router = useRouter()
  const classes = useStyles(props)
  const [isLoading, setIsLoading] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const getNftsFromWallet = async () => {
    let rpcUrl = localStorage.getItem(CUSTOM_RPC_KEY.URL) || DEFAULT_RPC_API;
    let connection = new anchor.web3.Connection(rpcUrl)
    setIsLoading(true)
    try {
      getNFTOwner(connection, wallet?.publicKey).then((result) => {
        
        setAlertState({
          open: true,
          message: result?'Login Success':'You have not our NFT',
          severity: 'info'
        })
        setIsLoading(false);
        if(result) {
          router.push("/mint")
        }
      })
    } catch(err) {
      setAlertState({
        open: true,
        message: 'Network Error',
        severity: 'error'
      })
      setIsLoading(false)
    }
  }
  useEffect(() => {
    (async () => {
      if (wallet) {
        await getNftsFromWallet();
      }
      else {
        setIsLoading(false);
      }
    })();
  }, [wallet]);

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
      <Snackbar
          open={alertState.open}
          autoHideDuration={3000}
          onClose={() => setAlertState({ ...alertState, open: false })}
        >
          <Alert
            onClose={() => setAlertState({ ...alertState, open: false })}
            severity={alertState.severity}
          >
            {alertState.message}
          </Alert>
        </Snackbar>
    </main>
  )
}

export default Wallet;
