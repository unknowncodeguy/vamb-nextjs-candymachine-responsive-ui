import React, { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {Modal, Box, TextareaAutosize, TextField, CircularProgress} from '@material-ui/core';

import Button from '@material-ui/core/Button';
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


import {
  ENVIRONMENT,
  SERVER_URL,
  MULTI_MINT_COUNT,
  CREATOR_ADDRESS,
  ALLOWED_NFT_NAME
} from "../../config/prod"

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineCM2State,
  mintOneCM2Token,
  mintMultipleCM2Token
} from "../../utils/candy-machine-cm";
import {
  CandyMachineME,
  getCandyMachineMEState,
  mintOneMEToken,
  mintMultipleMEToken
} from "../../utils/candy-machine-me";
import {
  getCandyMachineMLState,
  mintOneMLToken,
  mintMultipleMLToken
} from "../../utils/candy-machine-ml";
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
const customMintModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  bgcolor: '#0e0716',
  color: '#fff',
  boxShadow: 'rgb(218 218 218 / 59%) 0px 20.9428px 37.5225px -6.10831px',
  p: 6,
}


interface MachineInfo {
  _id: string,
  image_url: string,
  machine_type: string,
  machine_id: string,
  admin: string,
  price: number,
  machine_collection: string,
  total_items: number,
  go_live_date: number,
  is_soldout: boolean,
  captcha: boolean
}

interface MLConfig {
  CandyAddress: any,
  price: any,
  pda_buf: any,
  index_key: any,
  index_cap: any,
  wl_key: any,
  creator_1: any,
  config_key: any,
  start_public: any
}
const App = (props: any) => {
  const classes = useStyles(props)
  const wallet = useAnchorWallet();
  const [env, setEnv] = useState(ENVIRONMENT);
  const [selected, setSelected] = useState(false);
  const [customMintOpen, setCustomMintOpen] = useState(false);
  const [searchMachineId, setSearchMachineId] = useState('');
  const [version, setVersion] = useState('CM2');
  const [customUrl, setCustomUrl] = useState(props.rpcHost);
  const [rpcUrl, setRPCUrl] = useState('custom');
  const [searchState, setSearchState] = useState(true);
  const [scrapingUrl, setScrapingUrl] = useState('');
  const [machine, setMachine] = useState<any>();
  const [machineBuffer, setMachineBuffer] = useState<MachineInfo[]>([])
  const [isMinting, setIsMinting] = useState(false);
  const [mlConfig, setMLConfig] = useState('')
  const [isNFTOwner, setIsNFTOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isGetPage, setIsGetPage] = useState(true);
  const [scrapedPubkeys, setScrapedPubkeys] = useState([])
  const [handleOpenExtractMachineModal, setHandleOpenExtractMachineModal] = useState(false)
  const [scrapedMachineStates, setScrapedMachineStates] = useState<any[]>([]);
  const [scrapeResult, setScrapeResult] = useState(false);
  const [searchCollectionKey, setSearchCollectionKey] = useState('')
  const [loadMoreCount, setLoadMoreCount] = useState(1)
  const [machineVersion, setMachineVersion] = useState('CM2');
  const [parsedMLConfig, setParsedMLConfig] = useState<MLConfig>();
  const [isMLStatus, setIsMLStatus] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });


  const getMachines = (page: number, search: string, type: string, isPage: boolean) => {

    // setLoading(true);

    let data = '?';
    data += `page=${page}`;
    if (search) {
      data = `${data}&search=${search}`;
    }
    if(type) {
      data = `${data}&type=${type}`;
    }
    axios.get(`${SERVER_URL}/api/get-machines${data}`).then((res) => {
      const buffer:MachineInfo[] = []
      if(isPage) {
        Object.assign(buffer, machineBuffer);
        if(res.data.machines.length > 0) {
          for(let i = 0; i < res.data.machines.length; i++) {
            buffer.push(res.data.machines[i])
          }
          setMachineBuffer(buffer)
          setLoadMoreCount(page)
        }
      } else {
        console.log("here")
        setMachineBuffer(res.data.machines)
        setLoadMoreCount(page)
      }
      
    }).catch((err) => {
      setAlertState({
        open: true,
        message: 'server error!',
        severity: 'error'
      })

    });
  }
  const loadMoreMachines = () => {
    getMachines(loadMoreCount + 1, searchCollectionKey, machineVersion, true)
  }
  const handleCustomMintOpen = async () => {
    if(version == 'ML') {
      setCustomMintOpen(true);
    } else {
      if(!searchMachineId) {
        setAlertState({
          open: true,
          message: 'Input searching machine ID.',
          severity: 'error'
        })
        return;
      }
      setCustomMintOpen(true);
      setSearchState(true);
  
      const url = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
      const connection = new anchor.web3.Connection(url);
      try {
        let cndy: any;
        if(version == "CM2") {
          cndy = await getCandyMachineCM2State(
            wallet as anchor.Wallet,
            new PublicKey(searchMachineId),
            connection
          );
        }
        if(version == "ME") {
          cndy = await getCandyMachineMEState(
            wallet as anchor.Wallet,
            new PublicKey(searchMachineId),
            connection
          );
        } 
        setMachine(cndy);
      } catch (err: any) {
        console.log(err);
        setAlertState({
          open: true,
          message: 'Account does not exist: ' + searchMachineId,
          severity: 'error'
        })
        setCustomMintOpen(false);
      } finally {
        setSearchState(false);
      }
    }
    
  }
  const handleCustomMintClose = () => {
    setCustomMintOpen(false);
    setIsMLStatus(false)
  }
  const handleOneMint = async () => {
    try {
      setIsMinting(true);
      if (!wallet) {
        setAlertState({
          open: true,
          message: 'Connect your wallet',
          severity: 'info',
        });
        return;
      }
      if (wallet && machine?.program && wallet.publicKey) {
        const mint = anchor.web3.Keypair.generate();
        let mintTxId: any;
        if(version === "CM2") {
          mintTxId = (await mintOneCM2Token(machine, wallet.publicKey, mint))[0]
        }  
        if(version === "ME") {
          console.log("here")
          mintTxId = (await mintOneMEToken(machine, wallet.publicKey));
        }
        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            20000,
            props.connection,
            'singleGossip',
            true,
          );
        }

        if (!status?.err) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });

        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  }
  const handleGetMLStatus = async () => {
    setSearchState(true);
    // let jsonData: any;
    // await axios.post(`/extract-machine-ml`, {
    //   scrapingUrl: scrapingUrl
    // }).then((res)=>{
    //   if(res.data.status === 'success') {
    //     console.log(res.data.msg);
    //     jsonData = {
    //       CandyAddress: res.data.msg[0],
    //       pda_buf: res.data.msg[1].split(":")[1],
    //       price: res.data.msg[2].split(":")[1],
    //       index_cap: res.data.msg[3].split(":")[1],
    //       index_key: res.data.msg[4].match(/[1-9A-Za-z]{40,46}/g)[0],
    //       wl_key: res.data.msg[5].match(/[1-9A-Za-z]{40,46}/g)[0],
    //       creator_1: res.data.msg[6].match(/[1-9A-Za-z]{40,46}/g)[0],
    //       config_key: res.data.msg[7].match(/[1-9A-Za-z]{40,46}/g)[0],
    //     };
    //     let price = jsonData.price.split("e")[0]*Math.pow(10,jsonData.price.split("e")[1])
    //     jsonData.price = price;
    //     console.log(jsonData);
    //     setParsedMLConfig(jsonData)

    //   } else {
    //     setScrapeResult(false);
    //     setSearchState(false);
    //     setAlertState({
    //       open: true,
    //       message: 'Invalid URL',
    //       severity: 'error'
    //     })
    //   }
    // }).catch((error) => {
    //   setSearchState(false);
    //   setAlertState({
    //     open: true,
    //     message: 'Invalid URL',
    //     severity: 'error'
    //   })
    // })
    let config = JSON.parse(mlConfig);
    console.log(mlConfig)
    let configBuffer = {
      CandyAddress: config.CandyAddress,
      price: config.price,
      pda_buf: config.pda_buf,
      index_key: config.index_key,
      index_cap: config.index_cap,
      wl_key: config.wl_key,
      creator_1: config.creator_1,
      config_key: config.config_key,
      start_public: config.start_public
    }
    setParsedMLConfig(configBuffer)
    const url = rpcUrl === 'custom' ? customUrl : rpcUrl;
    const connection = new anchor.web3.Connection(url);
    if(config) {
      setSearchState(true);
      try {
        const cndy = await getCandyMachineMLState(
          wallet as anchor.Wallet,
          new PublicKey(configBuffer.CandyAddress),
          connection,
          configBuffer
        );
        setMachine(cndy);
        setIsMLStatus(true)
      } catch (err: any) {
        console.log(err);
        setAlertState({
          open: true,
          message: 'Account does not exist: ' + configBuffer.CandyAddress,
          severity: 'error'
        })
        setCustomMintOpen(false);
      } finally {
        setSearchState(false);
      }
    }
  }
  const handleOneMintML = async () => {
    if(version === "ML" && parsedMLConfig) {
      await mintOneMLToken(wallet,parsedMLConfig, setAlertState);
    }
  }
  const handleBeforeMultiMint = async () => {
    const now = Date.now();
    const startMachine = machine ? machine.state.goLiveDate.toNumber() * 1000 : now;
    let timeOut = now - startMachine;
    timeOut = timeOut < 0 ? 100 : timeOut;

    setTimeout(async () => {
      try {
        setIsMinting(true);
        if (!wallet) {
          setAlertState({
            open: true,
            message: 'Connect your wallet',
            severity: 'info',
          });
          return;
        }
        if (wallet && machine?.program && wallet.publicKey) {
          const mintTxId = version === "CM2" ? (
            await mintMultipleCM2Token(machine, wallet.publicKey, MULTI_MINT_COUNT)
          )[0] : (
            await mintMultipleMEToken(machine, machine.state.config, wallet.publicKey, machine.state.treasury, MULTI_MINT_COUNT)
          )[0];

          let status: any = { err: true };
          if (mintTxId) {
            status = await awaitTransactionSignatureConfirmation(
              mintTxId,
              props.txTimeout,
              props.connection,
              'singleGossip',
              true,
            );
          }

          if (!status?.err) {
            setAlertState({
              open: true,
              message: 'Congratulations! Mint succeeded!',
              severity: 'success',
            });

          } else {
            setAlertState({
              open: true,
              message: 'Mint failed! Please try again!',
              severity: 'error',
            });
          }
        }
      } catch (error: any) {
        // TODO: blech:
        let message = error.msg || 'Minting failed! Please try again!';
        if (!error.msg) {
          if (!error.message) {
            message = 'Transaction Timeout! Please try again.';
          } else if (error.message.indexOf('0x138')) {
          } else if (error.message.indexOf('0x137')) {
            message = `SOLD OUT!`;
          } else if (error.message.indexOf('0x135')) {
            message = `Insufficient funds to mint. Please fund your wallet.`;
          }
        } else {
          if (error.code === 311) {
            message = `SOLD OUT!`;
          } else if (error.code === 312) {
            message = `Minting period hasn't started yet.`;
          }
        }

        setAlertState({
          open: true,
          message,
          severity: "error",
        });
      } finally {
        setIsMinting(false);
      }
    }, timeOut);
  }

  const handleAfterMultiMint = async () => {
    try {
      setIsMinting(true);
      if (!wallet) {
        setAlertState({
          open: true,
          message: 'Connect your wallet',
          severity: 'info',
        });
        return;
      }
      if (wallet && machine?.program && wallet.publicKey) {
        const mintTxId = version === "CM2" ? (
          await mintMultipleCM2Token(machine, wallet.publicKey, MULTI_MINT_COUNT)
        )[0] : (
          await mintMultipleMEToken(machine, machine.state.config, wallet.publicKey, machine.state.treasury, MULTI_MINT_COUNT)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            'singleGossip',
            true,
          );
        }

        if (!status?.err) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });

        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  }
  const handleBeforeMultiMintML = async () => {
    let now = Date.now();
    let startMachine = machine ? machine?.state.goLiveDate.toNumber() * 1000 : now;
    let timeOut = startMachine - now;
    timeOut = timeOut < 0 ? 100 : timeOut;
    if(timeOut != 100) {
      setAlertState({
        open: true,
        message: "The NFT will be minted after " + Math.floor(timeOut / 1000 / 60) +"minutes!",
        severity: 'success',
      });
    }
    setTimeout(async() => {
      let isSuccess: any;
      if(version === "ML" && parsedMLConfig) {
        while(!isSuccess) {
          isSuccess = await mintOneMLToken(wallet,parsedMLConfig, setAlertState);
        }
        setTimeout(() => {
          isSuccess = 1;
        }, 60000);
      }
    }, timeOut);
  }
  useEffect(() => {
    (async () => {
      if (wallet) {
        setSelected(true);
        // getNftsFromWallet();
        getMachines(loadMoreCount, searchCollectionKey, machineVersion, isGetPage)
      }
      else {
        setSelected(false);
        setIsNFTOwner(false);
        setIsLoading(false);
      }
    })();
  }, [wallet, props.connection]);
  return (
    <Layout className={classes.root}>
       <WalletMultiButton className="btn_wallet"/>
      <>
        <Grid container alignItems="center" direction="row" spacing={3}>
          <Grid item md={1} className={`text-center`}>
            
          </Grid>
          <Grid item md={2} className={`text-center`}>
            <Typography variant="caption" className={`text-left`}>
              MODE
            </Typography>

            <FormControl variant="outlined" className={`${classes.machineVersion}`} size="small">
                <Select
                  value={`CM2`}
                  onChange={
                    (event: React.ChangeEvent<{ value: unknown }>) => {
                      const val = event.target.value as string;
                      setVersion(val);
                    }
                  }
                  label="Age"
                >
                  <MenuItem value={`CM2`}>Candy v2</MenuItem>
                  <MenuItem value={`ME`}>MagicEden</MenuItem>
                  <MenuItem value={`ML`}>MonkeLabs</MenuItem>
                </Select>
            </FormControl>
          </Grid>

          <Grid item md={6} className={`text-center`}>
            <Typography variant="caption" className={`text-left`}>
              ID
            </Typography>

            <FormControl variant="outlined" size="small" className={`${classes.search}`}>
              <OutlinedInput
                type={`text`}
                onChange= {(e) => setSearchMachineId(e.target.value)}
                placeholder={'CANDY MACHINE ID'}
              />
            </FormControl>
          </Grid>

          <Grid item md={2} className={`text-center`}>  
            <Typography variant="caption" className={`text-left`}>
              &nbsp;
            </Typography>
            <Button className={`${classes.openMint}`} variant="contained" color="primary" onClick={handleCustomMintOpen}>
              Open Mint
            </Button>
          </Grid>
          
          <Grid item md={1} className={`text-center`}>

          </Grid>
        </Grid>

        <Typography variant="h6" className={`text-center ${classes.title}`}>
          UPCOMING DROPS
        </Typography>

        <Grid container alignItems="center" spacing={3} direction="row">
          <Grid item md={3} className={`text-center`}>
            
          </Grid>
          <Grid item md={2} className={`text-center`}>
            <FormControl variant="outlined" className={`${classes.machineVersion}`} size="small">
                <Select
                  value={machineVersion}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    const val = event.target.value as string;
                    setMachineVersion(val);
                    setIsGetPage(false);
                    getMachines(1, searchCollectionKey, val, false)
                  }}
                  label="Age"
                >
                  <MenuItem value={`CM2`}>Candy V2</MenuItem>
                  <MenuItem value={`ME`}>Magic Eden</MenuItem>
                </Select>
            </FormControl>
          </Grid>

          <Grid item md={4} className={`text-center`}>
            <FormControl variant="outlined" size="small" className={`${classes.search}`}>
              <OutlinedInput
                type={`text`}
                onChange={(e) => {
                  setSearchCollectionKey(e.target.value);
                  setIsGetPage(false);
                  getMachines(1, e.target.value, machineVersion, false)
                }}
                placeholder={'SEATCH'}
              />
            </FormControl>
          </Grid>
          
          <Grid item md={3} className={`text-center`}>

          </Grid>
        </Grid>

        <Grid container alignItems="center" spacing={3} direction="row" className={`${styles.upcoming}`}>
          <Grid item md={1}></Grid>
          <Grid item container alignItems="center" direction="row" md={10} className={`text-center`}>
          {
            machineBuffer.map((machine, index) => {
              return <UpcomingMint 
                      machine={machine}
                      key={index}
                    />
            })
          }
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>

        <Grid container alignItems="center" spacing={3} direction="row">
          <Grid item md={4} className={`text-center`}></Grid>
          <Grid item md={4} className={`text-center`}>
            <Button className={`${styles.openMint}`} variant="contained" color="primary" onClick={() => {
                    loadMoreMachines(); 
                    setIsGetPage(true)
                  }}>
                LOAD MORE
            </Button>
          </Grid>
          <Grid item md={4} className={`text-center`}></Grid>
        </Grid>
        <Modal
              open={customMintOpen}
              onClose={handleCustomMintClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={customMintModalStyle}>
                <Typography id="modal-modal-description">
                  <FormControl variant="outlined" fullWidth error>
                    <InputLabel id="demo-simple-select-outlined-label" style={{ color: 'white' }}>CM version</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={version}
                      label="CM version"
                      onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                        const val = event.target.value as string;
                        setVersion(val);
                      }}
                    >
                      <MenuItem value={`CM2`}>Candy v2</MenuItem>
                      <MenuItem value={`ME`}>MagicEden</MenuItem>
                      <MenuItem value={`ML`}>MonkeLabs</MenuItem>
                    </Select>
                  </FormControl>
                  {version == 'ML' ? <>
                  {/* <TextField
                    onChange={(e) => setScrapingUrl(e.target.value)}
                    className={classes.modaltextfield}
                    error
                    id="input_siteurl"
                    label="Website URL"
                    value={scrapingUrl}
                    variant="outlined"
                  /> */}
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    value={mlConfig}
                    onChange={(e)=> {setMLConfig(e.target.value); setIsMLStatus(false)}}
                    placeholder=""
                    className="input-ml-config"
                  />
                  {machine &&<div className="status-ml-config">
                    <div className="ml-config-items">Price: {parsedMLConfig?.price}</div>
                    <div className="ml-config-items">Started Date: {machine.state.goLiveDate ? toDate(machine.state.goLiveDate)?.toString() : "UnSet"}</div>
                    <div className="ml-config-items">Amount: {machine ? `${machine.state.itemsRemaining}/${parsedMLConfig?.index_cap}` : ''}</div>
                  </div>}
                  <div className="modal_progress_spec">
                    {searchState == true &&
                      <CircularProgress className="modal_progress" />
                    }
                  </div>
                  
                  <div className="btn-ml-mint">
                    <Button disabled={isMLStatus} onClick={handleGetMLStatus} variant="outlined" className="card_full_btn">Get Status</Button>
                    <Button disabled={!isMLStatus} onClick={ handleOneMintML } variant="outlined" className="card_full_btn">Mint</Button>                    
                    <Button disabled={!isMLStatus} onClick={ handleBeforeMultiMintML } variant="outlined" className="card_full_btn">Mint Auto</Button> 
                  </div>
                  
                  </> : <>
                  <TextField
                    onChange={(e) => setSearchMachineId(e.target.value)}
                    className={classes.modaltextfield}
                    error
                    id="outlined-error"
                    label="Search"
                    value={searchMachineId}
                    variant="outlined"
                  />
                  <Grid item xs={12}>
                    <div className="custommint_refresh_header">
                      <div className="modal_custommint">Custom Mint</div>
                      {/* <div>
                        <IconButton aria-label="refresh" className="icon_btn">
                          <RefreshIcon />
                        </IconButton>
                      </div> */}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="modal_progress_container">
                      {searchState == true &&
                        <CircularProgress className="modal_progress" />
                      }
                      {searchState == false && version == "CM2" &&
                        <div className="custom_mint_config_info">
                          <Grid item xs={12}>
                            <div className="minting_list">
                              Available: {machine ? `${machine.state.itemsRemaining}/${machine?.state.itemsAvailable}` : ''}
                            </div>
                            <div className="minting_list">
                              Price: {machine ? machine.state.price.toNumber() / LAMPORTS_PER_SOL : ''}
                            </div>
                            <div className="minting_list">
                              Start date: {machine ?  machine?.state.isActive ? toDate(machine.state.goLiveDate)?.toString() : <div style={{ marginLeft: '10px' }}><MintCountdown
                                date={ new Date(
                                    machine.state?.goLiveDate?.toNumber() * 1000               
                                )}
                                
                              /></div> : ''}
                              
                            </div>
                            <div className="minting_list">
                              Captcha: {machine && machine.state.gatekeeper != null ? 'Yes' : 'No Required'}
                            </div>
                            <div className="minting_list">
                              Status: {machine && machine.state.isSoldOut ? 'SoldOut' : machine?.state.isActive ? 'Live' : 'Not Live'}
                            </div>
                            <div className="minting_list">
                              Times tried: 0
                            </div>
                          </Grid>
                        </div>
                      }
                      {searchState == false && version == "ME" &&
                        <div className="ME_config_info">
                          <Grid item xs={12}>
                            <div className="minting_list">
                              Available: {machine ? `${machine.state.itemsRemaining}/${machine?.state.itemsAvailable}` : ''}
                            </div>
                            <div className="minting_list">
                              Status: {machine && machine.state.isSoldOut ? 'SoldOut' : 'Live' }
                            </div>
                            <div className="minting_list">
                              Times tried: 0
                            </div>
                          </Grid>
                        </div>
                      }
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="close_btn_container">
                      <div className="minting_btn_container">
                      {searchState == false &&
                        <>
                        <Button onClick={handleOneMint} variant="contained" className="card_contain_btn">MINT</Button>
                        <Button onClick={handleBeforeMultiMint} variant="outlined" className="card_outline_btn">MINT AUTO</Button>
                        <Button onClick={handleAfterMultiMint} variant="outlined" className="card_outline_btn">M.A.I</Button>
                        </>
                      }
                        <Button onClick={handleCustomMintClose} className="card_btn">CLOSE</Button>
                      </div>
                    </div>
                  </Grid>
                  </>}
                  
                </Typography>
              </Box>
            </Modal>
      </>
    </Layout>
  );
};

export default App;