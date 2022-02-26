import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from 'next/image';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import styles from'./index.module.scss'

import logo from './../../public/icon.png'

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

const Discord = function (props: any) {
  const { children, className } = props
  const classes = useStyles(props)

  return (
    <main className={`${classes.root}`}>
      <Head>
        <title> Signin with Discord </title>
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
                <Button variant="contained" color={`primary`}>Signin With Discord</Button>
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

export default Discord;
