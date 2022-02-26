import React, { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {Modal, Box, TextareaAutosize, TextField, CircularProgress} from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Menu, Typography } from "@material-ui/core";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from 'axios'
import { Layout } from '../../components/templates';
import { UpcomingMint } from "../../components/molecules/UpcomingMint";
import { toDate, AlertState } from '../../utils/utils';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SolanaClient, SolanaClientProps } from '../../helpers/sol';
import { MintCountdown } from "../../utils/MintCountdown";

import styles from'./index.module.scss'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    machineVersion: {
      width: `100%`,
      border: `solid 1px ${theme.palette.primary.main}`,
      borderRadius: `8px`,
      "& *": {
        border: `none`,
        color: theme.palette.primary.main
      }
    },
    modaltextfield: {
      width: '100%',
      marginTop: 15,
    },
    search: {
      width: `100%`,
      border: `solid 1px ${theme.palette.primary.main}`,
      borderRadius: `8px`,
      "& *": {
        border: `none`,
        color: theme.palette.primary.main
      }
    },
    openMint: {
      width: `100%`
    },
    title: {
      padding: `48px 0 0 0`
    }
  })
)
const Market = (props: any) => {
  const classes = useStyles(props);

  const [query, setQuery] = useState(`ww`)

  useEffect(() => {
    (async () => {

    })();
  }, []);
  return (
    <Layout className={classes.root}>
        <Grid container alignItems="center" direction="row" spacing={3}>
          <Grid item md={3} className={`text-center`}>
            <Typography variant="h5" className={`text-left`}>
              
            </Typography>            
          </Grid>
          <Grid item md={10} className={`text-center`}>

          </Grid>
        </Grid>

        <Grid container alignItems="center" direction="row" spacing={3}>
          <Grid item md={3} className={`text-center`}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography align='center'>
                    Candy Machines
                  </Typography>
                  <Typography variant="h6"  align='center'>
                      7777
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>     
          </Grid>
          <Grid item md={3} className={`text-center`}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography align='center'>
                    SOL Price
                  </Typography>
                  <Typography  variant="h6" align='center'>
                      ${89.2} <span className={`${true && styles.plus}`}>{`+`} {9.2} % </span>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card> 
          </Grid>
          <Grid item md={3} className={`text-center`}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography align='center'>
                    Solana TPS
                  </Typography>
                  <Typography variant="h6" align='center'>
                    7777
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card> 
          </Grid>
          <Grid item md={3} className={`text-center`}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography align='center'>
                    Balance
                  </Typography>
                  <Typography variant="h6"  align='center'>
                    0.312
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card> 
          </Grid>
        </Grid>

        {query == `` && <>
        <Grid container className={`${styles.title}`} alignItems="center" direction="row">
          <Grid item md={6} className={`text-center`}>
            <Typography variant="h5" className={`text-left font-900`}>
              Popular Collections
            </Typography>            
          </Grid>
          <Grid item md={10} className={`text-center`}>

          </Grid>
        </Grid>

        <Grid container alignItems="center" direction="row" spacing={3}>
          {
            Array(6).fill(null).map(() =>{
              return (
              <Grid item md={4}>
                <Card >
                  <CardActionArea onClick={() => {}}>
                    <CardMedia
                      component="img"
                      alt={`NFT IMAGE`}
                      image={`https://img.freepik.com/free-photo/blockchain-digital-data-transmission-room-nft-non-fungible-token-d-illustration_250994-3477.jpg`}
                      title={`NFT TITLE`}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography gutterBottom variant="h6" className={`${styles.collectionTitle}`}>
                            COLLECTION NAMECOLLECTION NAME
                          </Typography>
                          <Typography gutterBottom variant="caption" className={`${styles.collectionText}`}>
                              {`THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK!`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={4} style={{padding: `0 24px`}}>
                      <Grid item md={2} className="text_right link">
                        <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="24" height="24"  style={{opacity: '0'}}/>
                      </Grid>
                      <Grid item md={2} className="text_right link">
                          <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="24" height="24" />
                          </a>
                      </Grid>

                      <Grid item md={2} className="text_right link">
                        <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/fluency/48/000000/discord-logo.png" width="24" height="24" />
                        </a>
                      </Grid>

                      <Grid item md={2} className="text_right link">
                        <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/ios/50/000000/globe--v1.png" width={24} height="24"/>
                        </a>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>     
              </Grid>
              )
            })
          }

        </Grid>

        <Grid container className={`${styles.title}`} alignItems="center" direction="row">
          <Grid item md={6} className={`text-center`}>
            <Typography variant="h5" className={`text-left font-900`}>
              New Collections
            </Typography>            
          </Grid>
          <Grid item md={10} className={`text-center`}>

          </Grid>
        </Grid>

        <Grid container alignItems="center" direction="row" spacing={3}>
          {
            Array(6).fill(null).map(() =>{
              return (
              <Grid item md={4}>
                <Card >
                  <CardActionArea onClick={() => {}}>
                    <CardMedia
                      component="img"
                      alt={`NFT IMAGE`}
                      image={`https://img.freepik.com/free-photo/blockchain-digital-data-transmission-room-nft-non-fungible-token-d-illustration_250994-3477.jpg`}
                      title={`NFT TITLE`}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography gutterBottom variant="h6" className={`${styles.collectionTitle}`}>
                            COLLECTION NAMECOLLECTION NAME
                          </Typography>
                          <Typography gutterBottom variant="caption" className={`${styles.collectionText}`}>
                              {`THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK!`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={4} style={{padding: `0 24px`}}>
                      <Grid item md={2} className="text_right link">
                        <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="24" height="24"  style={{opacity: '0'}}/>
                      </Grid>
                      <Grid item md={2} className="text_right link">
                          <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="24" height="24" />
                          </a>
                      </Grid>

                      <Grid item md={2} className="text_right link">
                        <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/fluency/48/000000/discord-logo.png" width="24" height="24" />
                        </a>
                      </Grid>

                      <Grid item md={2} className="text_right link">
                        <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/ios/50/000000/globe--v1.png" width={24} height="24"/>
                        </a>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>     
              </Grid>
              )
            })
          }

        </Grid>
        </>}

        {query != `` && <>
          <Grid container className={`${styles.title}`} alignItems="center" direction="row">
            <Grid item md={6} className={`text-center`}>
              <Typography variant="h5" className={`text-left font-900`}>
                FOUND COLLECTIONS
              </Typography>            
            </Grid>
            <Grid item md={10} className={`text-center`}>

            </Grid>
          </Grid>

          <Grid container alignItems="center" direction="row" spacing={3}>
          {
            Array(19).fill(null).map(() =>{
              return (
              <Grid item md={4}>
                <Card >
                  <CardActionArea onClick={() => {}}>
                    <CardMedia
                      component="img"
                      alt={`NFT IMAGE`}
                      image={`https://img.freepik.com/free-photo/blockchain-digital-data-transmission-room-nft-non-fungible-token-d-illustration_250994-3477.jpg`}
                      title={`NFT TITLE`}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography gutterBottom variant="h6" className={`${styles.collectionTitle}`}>
                            COLLECTION NAMECOLLECTION NAME
                          </Typography>
                          <Typography gutterBottom variant="caption" className={`${styles.collectionText}`}>
                              {`THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK! THIS IS MY MARKET SITE. YOU CAN BUY NFT QUICK!`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={4} style={{padding: `0 24px`}}>
                      <Grid item md={2} className="text_right link">
                        <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="24" height="24"  style={{opacity: '0'}}/>
                      </Grid>
                      <Grid item md={2} className="text_right link">
                          <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="24" height="24" />
                          </a>
                      </Grid>

                      <Grid item md={2} className="text_right link">
                        <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/fluency/48/000000/discord-logo.png" width="24" height="24" />
                        </a>
                      </Grid>

                      <Grid item md={2} className="text_right link">
                        <a href={`/`} target="_blank">
                          <img src="https://img.icons8.com/ios/50/000000/globe--v1.png" width={24} height="24"/>
                        </a>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>     
              </Grid>
              )
            })
          }

        </Grid>

          <Grid container alignItems="center" direction="row" className={`${styles.title}`}>
            <Grid item md={4} className={`text-center`}></Grid>
            <Grid item md={4} className={`text-center`}>
              <Button className={`customBtn`} variant="contained" color="secondary" onClick={() => {
                    }}>
                  LOAD MORE
              </Button>
            </Grid>
            <Grid item md={4} className={`text-center`}></Grid>
          </Grid>       
        </>}


    </Layout>
  );
};

export default Market;