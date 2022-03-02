import React, { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from 'axios'
import { useRouter } from 'next/router'

import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  FormControl,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Layout } from '../../components/templates';
import { AlertState , getNFTOwner } from '../../utils/utils';
import {
  CUSTOM_RPC_KEY,
  DEFAULT_RPC_API,
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
        setIsLoading(false);
        if(!result) {
          setAlertState({
            open: true,
            message: 'You have not our NFT',
            severity: 'info'
          })
          router.push("/")
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
          getNftsFromWallet()
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
          
        } finally {

        }
      }
      else {
      }
      setIsLoading(false);
    })();
  }, [wallet]);
  return (
    <Layout className={classes.root}>
        {isLoading && 
          <Grid container alignItems="center" direction="row" spacing={3}>
            <Grid item md={12} className={`text-center mt-24`}>
              <CircularProgress className="modal_progress"/>
            </Grid>
          </Grid>
        }

        {!isLoading && <>

          <Grid container alignItems="center" direction="row" spacing={3}>
            <Grid item xs={6} sm={6} md={6} lg={6}></Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} className={`text-right`}>
                <FormControl variant="outlined" size="small" className={`${classes.search}`}>
                <OutlinedInput
                  type={`text`}
                  placeholder={'Search Collection'}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  onKeyDown={(e)=>{
                    if(e.key == 'Enter') {
                      getSearchCollection(searchFilter)
                    }
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() => {getSearchCollection(searchFilter)}}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>                 
            </Grid>
          </Grid>

          {searchCollectionKey == `` && <>
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
                <Grid item md={4} lg={3}>
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
                <Grid item md={4} lg={3}>
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

          {searchCollectionKey != `` && <>
            <Grid container className={`${styles.title}`} alignItems="center" direction="row">
              <Grid item md={6} className={`text-center`}>
                <Typography variant="h5" className={`text-left font-900`}>
                  FOUND COLLECTIONS
                </Typography>            
              </Grid>
              <Grid item md={10} className={`text-center`}>

              </Grid>
            </Grid>

            <Grid container spacing={2} className="pt_24 pb_24">
                <Grid item xs={12} className="white">
                  <h2>{`Market Search Results: ${searchCollectionKey}`}</h2>
                </Grid>

                  {
                    allCollections.filter((col: any, index: number) => {return col.name?.includes(searchCollectionKey)}).length < 1 &&
                    <Grid item md={12} className={``}>
                      <Typography variant="h5" className={`text-center`}>
                      No Results
                      </Typography>
                    </Grid>
                  }

                  {
                    allCollections.filter((col: any, index: number) => {return col.name?.includes(searchCollectionKey)}).filter((col:any, index: number) => {return index < page * LOAD_COUNT}).map((_item:any, index:number) => {
                    return  <Grid item xs={6} sm={4} md={3} key={index}>
                              <Card >
                                <CardActionArea onClick={() => viewCollection(_item.symbol)}>
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
                                  <Grid container direction="row" justifyContent="flex-end" alignItems="center" className="white" spacing={2} style={{padding: '0 16px'}}>
                                  <Grid item xs={2} className="white text_right link">
                                        
                                  </Grid>
                                  {_item.twitter != `` && 
                                      <Grid item xs={2} className="white text_right link">
                                        <a href={`${_item.twitter}`} target="_blank">
                                        <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="36" height="36" className={`hover`}/>
                                        </a>
                                      </Grid>
                                    }

                                    {_item.discord != `` && 
                                      <Grid item xs={2} className="white text_right link">
                                        <a href={`${_item.discord}`} target="_blank">
                                        <img src="https://img.icons8.com/fluency/48/000000/discord-logo.png" width="36" height="36" className={`hover`}/>
                                        </a>
                                      </Grid>
                                    }

                                    {_item.website != `` && 
                                      <Grid item xs={2} className="white text_right link">
                                        <a href={`${_item.website}`} target="_blank">
                                        <img src="https://img.icons8.com/ios/50/000000/globe--v1.png" width={32} className={`hover`}/>
                                        </a>
                                      </Grid>
                                    }
                                  </Grid>
                                </CardActions>
                              </Card>
                            </Grid>
                    })
                  }
            </Grid>

            <Grid container className="pt-24">
                <Grid item md={12} className="text-center">
                  {
                    allCollections.filter((col: any, index: number) => {return col.name?.includes(searchCollectionKey)}).length > page * LOAD_COUNT &&

                    <Button onClick={loadMore}  variant="contained" className={`customBtn ${styles.openMint}`}>LOAD MORE</Button>
                  }
                </Grid>
            </Grid>
                
          </>}        
        </>}

    </Layout>
  );
};

export default Market;