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
import { useRouter } from 'next/router'

import {
  ENVIRONMENT,
  SERVER_URL,
  MULTI_MINT_COUNT,
  CREATOR_ADDRESS,
  ALLOWED_NFT_NAME,
  CORS_PROXY_API,
  MAGICEDEN_API,
  RELICS_API,
  LOAD_COUNT
} from "../../config/prod"
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
  const wallet = useAnchorWallet();
  const router = useRouter()
  const [allCollections, setAllCollections] = useState<any>([]);
  const [popularCollections, setPopularCollections] = useState<any>([]);
  const [newCollections, setNewCollections] = useState<any>([]);
  const [searchCollectionKey, setSearchCollectionKey] = useState(``);
  const [searchFilter, setSearchFilter] = useState(``)
  const [isLoading, setIsLoading] = useState(false);
  const [stat, setStat] = useState({
    currPrice: 0,
    numV1s: 0,
    numV2s: 0,
    priceDelta: 0,
    tps: 0,
    balance: 0
  });

  const [query, setQuery] = useState(``)
  const [page, setPage] = useState(1);
  const loadMore = () => {
    const inc = page + 1;
    setPage(inc);
  }
  const viewCollection = (id:any) => {
    let path = `/collection/${id}`;
    router.push(path);
  }
  
  const getSearchCollection = async (search: string) => { 
    setIsLoading(true);
    setPage(1);
    setSearchCollectionKey(search);
    
    if(wallet && search != ``) {
      if(allCollections.length < 1) {
        try{
          const allCollection:any = await axios({
            method: 'get',
            url: `${CORS_PROXY_API}${MAGICEDEN_API.ALL_COLLECTION}`
          });
          if(allCollection.data?.collections?.length > 0) {
            setAllCollections([...allCollection.data.collections]);
          }
        }
        catch(err){
          console.log(`Can't get all collections!`, err);
        }
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      if (wallet) {
        try {
          if(searchCollectionKey == ``) {
            const populars = await axios({
              method: 'get',
              url: `https://magiceden.boogle-cors.workers.dev`,
              params: {
                u: MAGICEDEN_API.POPULAR_COLLECTION
              }
            });
            console.log(populars)
            if(populars.data?.collections?.length > 0) {
              setPopularCollections([...populars.data.collections]);
            }
            const statValue = await axios({
              method: 'post',
              url: `${CORS_PROXY_API}${RELICS_API.STAT}`
            });
            const statBalance = await axios({
              method: 'post',
              url: `${CORS_PROXY_API}${RELICS_API.PROGRAM}`,
              data: {
                id: "1",
                jsonrpc: "2.0",
                method: "getBalance",
                params: [wallet.publicKey.toString()]
              }
            });
            if(statValue.data?.result){
              if(statBalance.data?.result?.value) {
                setStat({...statValue.data.result, balance: statBalance.data.result.value});
              }
              else {
                setStat({...statValue.data.result});
              }
            }
            const newes = await axios({
              method: 'get',
              url: `${CORS_PROXY_API}${MAGICEDEN_API.NEW_COLLECTION}`
            });
            if(newes?.data?.collections?.length > 0) {
              setNewCollections([...newes.data.collections]);
            }

          }
          else {
            setPopularCollections([]);
            setNewCollections([]);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log(`Axios Error! ${error}`);
          } else {
            console.log(`Unexpected error! ${error}`);
          }
        } finally {

        }
      }
      else {
      }
      setIsLoading(false);
    })();
  }, [wallet, props.connection]);
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
                      {stat.numV2s}
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
                  <Typography className={`white`} align='center'>
                    <Typography className={`white`} align='center' display='inline'>
                    ${stat.currPrice.toFixed(2)}
                    </Typography>
                    <Typography className={`white pl_8`} align='center' display='inline' style={{ color: stat.priceDelta < 0 ? `#dc3545` : `#198754` }}>
                    {stat.priceDelta > 0 && `+`}{(stat.priceDelta * 100).toFixed(2)}%
                    </Typography>
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
                    {stat.tps}
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
                    {stat.balance}
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

        <Grid container alignItems="flex-start" direction="row" spacing={3}>
          {
            popularCollections.map((_item:any, index:number) =>{
              return (
              <Grid item md={4}>
                <Card >
                  <CardActionArea onClick={() => {viewCollection(_item.symbol)}}>

                    <div className="imageWrapper">
                      <div className="imageOver">
                        <CardMedia
                          component="img"
                          alt={_item.name}
                          image={_item.image}
                          title={_item.name}
                          className={`${styles.collectionImage}`}
                        />
                      </div>
                    </div>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography gutterBottom variant="h6" className={`${styles.collectionTitle}`}>
                          {_item.name}
                          </Typography>
                          <Typography gutterBottom variant="caption" className={`${styles.collectionText}`}>
                          {_item.description}
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

        <Grid container alignItems="flex-start" direction="row" spacing={3}>
          {
            newCollections.map((_item:any, index:number) =>{
              return (
              <Grid item md={4}>
                <Card className={`${styles.collection}`}>
                  <CardActionArea onClick={() => {viewCollection(_item.symbol)}}>
                    <div className="imageWrapper">
                      <div className="imageOver">
                        <CardMedia
                          component="img"
                          alt={_item.name}
                          image={_item.image}
                          title={_item.name}
                          className={`${styles.collectionImage}`}
                        />
                      </div>
                    </div>

                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography gutterBottom variant="h6" className={`${styles.collectionTitle}`}>
                          {_item.name}
                          </Typography>
                          <Typography gutterBottom variant="caption" className={`${styles.collectionText}`}>
                          {_item.description}
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
          `SEARCH RESULT`
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