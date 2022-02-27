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
import { useRouter } from "next/router";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/Search';
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';


import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from 'axios'
import { Layout } from '../../components/templates';
import { UpcomingMint } from "../../components/molecules/UpcomingMint";
import { toDate, AlertState } from '../../utils/utils';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SolanaClient, SolanaClientProps } from '../../helpers/sol';
import { MintCountdown } from "../../utils/MintCountdown";
import { quickOneBuy, quickMultiBuy } from "../../utils/market-sniper";

import {
  ENVIRONMENT,
  SERVER_URL,
  MULTI_MINT_COUNT,
  UPDATEAUTHORITY_ADDRESS,
  ALLOWED_NFT_NAME,
  CORS_PROXY_API,
  MAGICEDEN_API,
  RELICS_API,
  LOAD_COUNT
} from "../../config/prod"
import styles from'./index.module.scss'

const useStyles = makeStyles((theme) => ({
  root: {

  },
  collection_image: {
    borderRadius: '50%',
    width: '146px'
  },
  textInfo: {
    width: '100%',
    textAlign: 'center'
  },
  loading: {
    width: '100%',
    textAlign: 'center'
  },
  collection: {
    borderRadius: '28px',
    cursor: 'pointer',
    marginBottom: 16,
    boxShadow: '0 3px 20px 0 rgba(0,0,0,0.12)',
    transitionTimingFunction: 'cubicBezier(.25,.25,.75,.75)',
    transitionDuration: '.3s'
  },
  nftTitle: {
    overflow: 'hidden',
    textOverflow: `ellipsis`,
    whiteSpace: 'nowrap'
  },
  nftVerified: {
    overflow: 'hidden',
    color: 'rgb(83, 186, 255)',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    marginBottom: '0px'
  },
  nftVerifiedIcon: {
    width: '13px',
    color: 'rgb(83, 186, 255)',
    marginLeft: '4px'
  },
  collectionImage: {
    borderRadius: '18px',
    height: '186px'
  },
  nftPrice : {

  },
  buy: {
    padding: '6px 12px'
  },
  pad: {
    marginBottom: `8px !important`
  },
  toppad: {
    marginTop: `8px !important`
  },
  btn: {
    width: `100%`
  }
}));
interface Attr {
  key: string;
  val: string;
}
const Collection = (props: any) => {
  const classes = useStyles(props);
  const wallet = useAnchorWallet();
  const router = useRouter()
  const {id} = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [detailData, setDetailData] = useState<any>();
  const [detailStat, setDetailStat] = useState<any>();
  const [attributes, setAttributes] = useState<any>([]);
  const [nfts, setNfts] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [filter, setFtiler] = useState();
  const [sniperLimitPrice, setSniperLimitPrice] = useState(0);
  const [sniperLimitNumber, setSniperLimitNumber] = useState(1);
  const [attrSearchKey, setAttrSearchKey] = useState<Attr[]>([]);
  const [query, setQuery] = useState('');
  const [timerId, setTimerId] = useState(0);
  const [autoLoading, setAutoLoading] = useState(false);
  const [snipingToggleFlag, setSnipingToggleFlag] = useState(false)
  const [remainCount, setRemainCount] = useState(1);
  const url = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
  const connection = new anchor.web3.Connection(url);
  const quickBuy = async (id:number) => {
    console.log(nfts[id]);
    if(wallet) {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: 'recent',
      });
      await quickOneBuy(nfts[id], wallet?.publicKey, provider)
    }
  }
  const sniperBuyItems = async (items: any) => {
    if(wallet) {
      const provider = new anchor.Provider(connection, wallet, {
        preflightCommitment: 'recent',
      });
      await quickMultiBuy(items, wallet?.publicKey, provider)
    }
  }
  const handleSniping = async () => {
    setSnipingToggleFlag(!snipingToggleFlag);
    if(!snipingToggleFlag) {
      startAutoSniping()
    } else {
      pauseAutoSniping()
    }
  }

  const myInterval = () => {
    const id = window.setInterval(async() => {
      try {
        if(remainCount) {
          const resNfts = await axios({
            method: 'get',
            url: `${CORS_PROXY_API}${MAGICEDEN_API.NFTS}${query}`
          });
          setNfts([...resNfts.data.results]);
          let snipNfts = [], count = 0;
          for(let i=0;i<resNfts.data.results.length; i++) {
            if(resNfts.data.results[i].price <= sniperLimitPrice) {
              snipNfts.push(resNfts.data.results[i]);
              count++
            }
            if(count == remainCount) {
              console.log("here")
              break;
            }
          }
          sniperBuyItems(snipNfts)
          setRemainCount(remainCount - count)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(`Axios Error! ${error}`);
        } else {
          console.log(`Unexpected error! ${error}`);
        }
      } finally {
  
      }
    }, 5000)
    return id;
  }
  const startAutoSniping = () => {
    setAutoLoading(true)
    const id = myInterval()
    setTimerId(id)
  }
  const pauseAutoSniping = () => {
    setAutoLoading(false);
    setRemainCount(sniperLimitNumber)
    if(timerId) {
      window.clearInterval(timerId);
    }
  }

  const handleAttrSearch = async (insert: any) => {
    let attrBuf: any = [...attrSearchKey], flag = 0
    for(let i=0;i<attrBuf.length; i++) {
      if(attrBuf[i].key == insert.key) {
        if(insert.val == '') {
          attrBuf.splice(i, 1);
          console.log("come here", attrBuf)
        } else {
          attrBuf[i].val = insert.val;
        }
        flag = 1;
      }
    }
    console.log(attrBuf)
    if(flag == 0) {
      attrBuf= [...attrBuf,insert];
    }
    setAttrSearchKey(attrBuf);
    console.log(attrBuf);
    let str: any = ``;
    if(attrBuf.length) {
      for(let i=0; i<attrBuf.length;i++) {
        str += `{"$or":[{"attributes":{"$elemMatch":{"trait_type":"${attrBuf[i].key}","value":"${attrBuf[i].val}"}}}]},`
      }
      console.log(str);
      let q = encodeURIComponent(`{"$match":{"collectionSymbol":"${id}","$and":[
        ${str.slice(0, str.length - 1)}
      ]},"$sort":{"takerAmount":1,"createdAt":-1},"$skip":0,"$limit":20}`);
      try {
        const resNfts = await axios({
          method: 'get',
          url: `${CORS_PROXY_API}${MAGICEDEN_API.NFTS}${q}`
        });
        setQuery(q);
        setNfts([...resNfts.data.results]);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(`Axios Error! ${error}`);
        } else {
          console.log(`Unexpected error! ${error}`);
        }
      } finally {
  
      }
    } else {
      const q = encodeURIComponent(`{"$match":{"collectionSymbol":"${id}"},"$sort":{"createdAt":-1},"$skip":${page == 1 ? 0 : ((page-1) * LOAD_COUNT - 1)},"$limit":${LOAD_COUNT}}`);
        setQuery(q);
        try {
          const resNfts = await axios({
            method: 'get',
            url: `${CORS_PROXY_API}${MAGICEDEN_API.NFTS}${q}`
          });

          if(resNfts.data?.results?.length > 0) {
            setNfts([...resNfts.data.results]);
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
    
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      
      if (wallet) {
        const q = encodeURIComponent(`{"$match":{"collectionSymbol":"${id}"},"$sort":{"createdAt":-1},"$skip":${page == 1 ? 0 : ((page-1) * LOAD_COUNT - 1)},"$limit":${LOAD_COUNT}}`);
        setQuery(q);
        try {
          const resNfts = await axios({
            method: 'get',
            url: `${CORS_PROXY_API}${MAGICEDEN_API.NFTS}${q}`
          });

          if(resNfts.data?.results?.length > 0) {
            setNfts([...resNfts.data.results]);
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
  }, [page, filter, wallet]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (wallet) {
        try {
          const collectDetail = await axios({
            method: 'get',
            url: `${CORS_PROXY_API}${MAGICEDEN_API.COLLECTION}${id}`
          });
          
          if(collectDetail.data) {
            setDetailData({...collectDetail.data})
          }
          const collectStat = await axios({
            method: 'get',
            url: `${CORS_PROXY_API}${MAGICEDEN_API.COLLECTION_DETAIL}${id}`
          });
          console.log(collectStat.data?.results)

          if(collectStat.data?.results) {
            setDetailStat({...collectStat.data.results})

            if(collectStat.data?.results?.availableAttributes?.length > 0) {
              let attrBuffer = collectStat.data.results.availableAttributes;
              let attr: any = [];
              for(let i=0; i<attrBuffer.length; i++) {
                let flag = 0;
                for(let j=0; j<attr.length; j++) {
                  if(attr[j].key == attrBuffer[i].attribute.trait_type) {
                    flag = 1
                    break
                  }
                }
                if(!flag) {
                  attr.push({
                    key:attrBuffer[i].attribute.trait_type,
                    val:[]
                  })
                }
              }
              for(let i=0; i<attr.length; i++) {
                for(let j=0; j<attrBuffer.length; j++) {
                  if(attr[i].key == attrBuffer[j].attribute.trait_type) {
                    attr[i].val.push(attrBuffer[j].attribute.value)
                  }
                }
              }
              console.log(attr)
              setAttributes([...attr])
            }
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
  }, [wallet]);
  return (
    <Layout className={classes.root}>
        <Grid container alignItems="center" direction="row" spacing={3}>
          <Grid item md={3} className={`text-center`}>
            <Typography variant="h5" className={`text-left`}>
            { isLoading &&
              <div className={classes.loading + ' mt_48'}>
                <CircularProgress />
              </div>
            }
            </Typography>            
          </Grid>
          <Grid item md={10} className={`text-center`}>

          </Grid>
        </Grid>

        <Grid container spacing={2} className="pt_16" direction="row" justifyContent="center" alignItems="center">
          <Grid item md={2} className=" text-center" >
            <img src={detailData?.image? detailData.image: ''} className={`${classes.collection_image}`} />
          </Grid>
        </Grid>

        <Grid container spacing={2} className="pt_16" direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={12} className="text-center" >
            <Typography variant="h6" >
            {detailData?.name? detailData.name: ''}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="pt_16" direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={12} className="" >
            <Typography variant="subtitle2">
            {detailData?.description? detailData.description: ''}
            </Typography>
          </Grid>
        </Grid>

        <Grid container className={`${styles.title}`} direction="row"></Grid>

        <Grid container spacing={2} className={`${styles.title}`} direction="row" alignItems="center">
          <Grid item container xs={12} className=" text_center" spacing={2} direction="row" alignItems="center">
            <Grid item xs={4} sm={3} md={2}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography className={`font_grey`} align='center'>
                      Floor Price
                    </Typography>
                    <Typography  align='center'>
                      <Typography  align='center' display='inline'>
                      {detailStat?.floorPrice? (detailStat?.floorPrice / LAMPORTS_PER_SOL).toFixed(2) : ``} SOL
                      </Typography>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={4} sm={3} md={2}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography className={`font_grey`} align='center'>
                      Total Volume
                    </Typography>
                    <Typography  align='center'>
                      <Typography  align='center' display='inline'>
                      {detailStat?.volumeAll? (detailStat?.volumeAll / LAMPORTS_PER_SOL).toFixed(2) : ``}
                      </Typography>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={4} sm={3} md={2}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography className={`font_grey`} align='center'>
                      24H Volume
                    </Typography>
                    <Typography  align='center'>
                      <Typography  align='center' display='inline'>
                      {detailStat?.volume24hr? (detailStat?.volume24hr / LAMPORTS_PER_SOL).toFixed(2) : ``}
                      </Typography>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={4} sm={3} md={2}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography className={`font_grey`} align='center'>
                      24H Avg Price
                    </Typography>
                    <Typography  align='center'>
                      <Typography  align='center' display='inline'>
                      {detailStat?.avgPrice24hr? (detailStat?.avgPrice24hr / LAMPORTS_PER_SOL).toFixed(2) : ``}
                      </Typography>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            
            <Grid item xs={4} sm={3} md={2}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography className={`font_grey`} align='center'>
                      Listed Count
                    </Typography>
                    <Typography  align='center'>
                      <Typography  align='center' display='inline'>
                      {detailStat?.listedCount? detailStat?.listedCount : ``}
                      </Typography>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid container className={`${styles.title}`} direction="row"></Grid>

        <Grid container spacing={2} className={`${styles.title}`} direction="row">
          <Grid item xs={12} sm={4} md={3}>
            <Accordion className={`mb-16`} expanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{
                  paddingTop: '0px',
                  paddingBottom: '0px'
                }}
              >
                <Typography>Sniper Settings</Typography>
              </AccordionSummary>
              <AccordionDetails >
                <Grid container direction="row" alignItems="center" className="">
                  <Grid item xs={12} sm={12} md={12} className={`mb-8`}>
                    <Typography variant="caption">
                      Price
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`mb-16 ${classes.pad}`}>
                      <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        value={sniperLimitPrice}
                        onChange={(e) => setSniperLimitPrice(parseFloat(e.target.value))}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`mb-8`}>
                    <Typography variant="caption">
                      Number
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`mb-16`}>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      value={sniperLimitNumber}
                      onChange={(e) => {
                        setSniperLimitNumber(parseInt(e.target.value));
                        setRemainCount(parseInt(e.target.value))
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`text_center`}>
                    <Button size="medium" onClick={handleSniping} style={{width: '100%', backgroundColor: '#6E0071'}}>
                      {autoLoading?<CircularProgress />:'Start Sniping'}
                    </Button>  
                  </Grid>  
                </Grid>                
              </AccordionDetails>
            </Accordion>
            <Grid container className={`${styles.title}`} direction="row"></Grid>
            <Accordion className={``} expanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{
                  paddingTop: '0px',
                  paddingBottom: '0px'
                }}
              >
              <Typography>Attribute Fileters</Typography>
              </AccordionSummary>
              <AccordionDetails >
              <Grid container direction="row" alignItems="center" className="white mt_8">
                      {
                        attributes.map((item: any, index: number)=>{
                          return <Grid item xs={12} sm={12} md={12} style={{marginTop: '10px'}}  key={index}>
                                  <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="demo-simple-select-outlined-label" style={{ color: 'white' }}>{item.key}</InputLabel>
                                      <Select
                                        id="demo-simple-select-outlined"
                                        labelId="demo-simple-select-outlined-label"  
                                        name={item.key}                                        
                                        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                          const val = event.target.value as string;
                                          handleAttrSearch({
                                            key:item.key,
                                            val
                                          })
                                        }}
                                      >
                                      <MenuItem value=''>{`None`}</MenuItem>
                                      {item.val.map((v:any,i:number) => {
                                          return <MenuItem value={v} key={i}>{v}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>                             
                              </Grid>
                        })
                      }
                      </Grid>               
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item container spacing={2} xs={12} sm={8} md={9}>
          {nfts.length?
            nfts.map((item: any, index: number) => {
            return  <Grid item xs={6} sm={6} md={4} key={index}>
                      <Card className={classes.collection}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            alt={item.title}
                            image={item.img}
                            title={item.title}
                            className={classes.collectionImage}
                          />
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} className="">
                                <Typography gutterBottom variant="h6" className={`${classes.nftTitle}`}>
                                  {item.title}
                                </Typography>
                                <div className="d_flex align_items_center">
                                  <Typography gutterBottom variant="body1" className={`${classes.nftVerified}`}>
                                  {item.collectionTitle}
                                    <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`${classes.nftVerifiedIcon} svg-inline--fa fa-check-circle fa-w-16`}><g className="fa-group"><path className="fa-secondary" fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm155.31 195.31l-184 184a16 16 0 0 1-22.62 0l-104-104a16 16 0 0 1 0-22.62l22.62-22.63a16 16 0 0 1 22.63 0L216 308.12l150.06-150.06a16 16 0 0 1 22.63 0l22.62 22.63a16 16 0 0 1 0 22.62z"></path><path className="fa-primary" fill="currentColor" d="M227.31 387.31a16 16 0 0 1-22.62 0l-104-104a16 16 0 0 1 0-22.62l22.62-22.63a16 16 0 0 1 22.63 0L216 308.12l150.06-150.06a16 16 0 0 1 22.63 0l22.62 22.63a16 16 0 0 1 0 22.62l-184 184z"></path></g></svg>
                                  </Typography>
                                </div>

                                <Typography gutterBottom variant="body2" className={`${classes.nftPrice}`}>
                                  {item.price} SOL
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                        <CardActions style={{padding: '0px'}}>
                          <Grid container direction="row" alignItems="center" className="" spacing={2} style={{padding: '8px 16px 16px 16px'}}>  
                            <Grid item xs={12} className=" text_right link">
                              <Button onClick={(e) => {quickBuy(index)}} size="small" className={`${classes.btn}`}>
                                Buy
                              </Button>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </Card>
                    </Grid>
            }): <p className="attr-no-result">No Result</p>
          }
          </Grid>
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
        </Grid>


    </Layout>
  );
};

export default Collection;