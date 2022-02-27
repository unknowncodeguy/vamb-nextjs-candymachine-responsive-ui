import {useState, useMemo} from "react";
import Image from 'next/image'
import styled from "styled-components";
import * as anchor from "@project-serum/anchor";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import CopyToClipboard from "../../utils/CopyToClipboard"
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import IconButton from '@material-ui/core/IconButton';
import { toDate } from "../../utils/utils";
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
  SERVER_URL,
} from "../../config/prod";
import axios from "axios";
import {useAnchorWallet} from "@solana/wallet-adapter-react";

import styles from './UpcomingMint.module.scss'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    item: {
      border: `solid 1px ${theme.palette.primary.main}`,
      borderRadius: `8px`
    }
  })
)
const DivPublicKey = styled.div`
font-family: fangsong !important;
display: inline-block;
width: 245px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
margin-left: 20px;
margin-bottom: -5px;
`
const mintingModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  bgcolor: '#010001',
  color: '#fff',
  border: '2px solid #000',
  boxShadow: 'rgb(218 218 218 / 59%) 0px 20.9428px 37.5225px -6.10831px',
  p: 6,
}
  /**
   * Next.js optimized <ListItem>
   * @param props Any
   */
export const UpcomingMint = function (props: any) {
  const classes = useStyles(props)
  const [mintingOpen, setMintingOpen] = useState(false);
  const [progressState, setProgressState] = useState(true);
  const [isCompleteCountDown, setIsCompleteCountDown] = useState(false);
  const [isMinting, setIsMinting] = useState(false)
  const [machine, setMachine] = useState<any>();
  const wallet = useAnchorWallet(); 
  const url = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
  const connection = new anchor.web3.Connection(url);
  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }
    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const handleOneMint = async () => {
    try {
      setIsMinting(true);
      if (!wallet) {
        props.setAlertState({
          open: true,
          message: 'Connect your wallet',
          severity: 'info',
        });
        return;
      }
      if (wallet && machine?.program && wallet.publicKey) {
        const mint = anchor.web3.Keypair.generate();
        if(props.machine.captcha) {
          await axios.get("https://passv2.civic.com/?provider=hcaptcha&redirectUrl=http://cmbot-3dboogles.herokuapp.com/&networkAddress=ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6&action=proofOfWalletOwnership&wallet=25Krheds8cwMam9TmwJkkXW5yRKW37oLNLYz1rfHFdgU&chain=solana", {headers: {"Access-Control-Allow-Origin": "*"}})
        }
        const mintTxId = props.machine.machine_type == "CM2" ? (
          await mintOneCM2Token(machine, wallet.publicKey, mint)
        )[0] : (await mintOneMEToken(machine, wallet.publicKey));

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            10000,
            connection,
            'singleGossip',
            true,
          );
        }

        if (!status?.err) {
          props.setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });

        } else {
          props.setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      console.log(error);
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

      props.setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  }

  const handleBeforeMultiMint = async () => {
    const now = new Date().getTime();
    const startMachine = machine ? machine.state.goLiveDate.toNumber() * 1000 : now;
    let timeOut = now - startMachine;
    timeOut = timeOut < 0 ? 100 : timeOut;

    setTimeout(async () => {
      try {
        setIsMinting(true);
        if (!wallet) {
          props.setAlertState({
            open: true,
            message: 'Connect your wallet',
            severity: 'info',
          });
          return;
        }
        if (wallet && machine?.program && wallet.publicKey) {

          const mintTxId = props.machine_type == "CM2" ? (
            await mintMultipleCM2Token(machine, wallet.publicKey, props.multi_mint_count)
          )[0] : (
            await mintMultipleMEToken(machine, machine.state.config, wallet.publicKey, machine.state.treasury, props.multi_mint_count)
          )[0];
          let status: any = { err: true };
          if (mintTxId) {
            status = await awaitTransactionSignatureConfirmation(
              mintTxId,
              10000,
              connection,
              'singleGossip',
              true,
            );
          }

          if (!status?.err) {
            props.setAlertState({
              open: true,
              message: 'Congratulations! Mint succeeded!',
              severity: 'success',
            });

          } else {
            props.setAlertState({
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

        props.setAlertState({
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
        props.setAlertState({
          open: true,
          message: 'Connect your wallet',
          severity: 'info',
        });
        return;
      }
      if (wallet && machine?.program && wallet.publicKey) {
        const mintTxId = props.machine_type == "CM2" ? (
          await mintMultipleCM2Token(machine, wallet.publicKey, props.multi_mint_count)
        )[0] : (
          await mintMultipleMEToken(machine, machine.state.config, wallet.publicKey, machine.state.treasury, props.multi_mint_count)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            10000,
            connection,
            'singleGossip',
            true,
          );
        }

        if (!status?.err) {
          props.setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });

        } else {
          props.setAlertState({
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

      props.setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
    }
  }

  const handleMintingOpen = () => {
    setProgressState(true);
    setMintingOpen(true);
    (async () => {
        if (!anchorWallet) {
            return;
        }
        if (props.machine.machine_id) {
            try {
              let cndy: any;
              if(props.machine.machine_type == "CM2") {
                cndy = await getCandyMachineCM2State(
                  anchorWallet,
                  new PublicKey(props.machine.machine_id),
                  connection
                );
              }
              if(props.machine_type == "ME") {
                cndy = await getCandyMachineMEState(
                  anchorWallet,
                  new PublicKey(props.machine_id),
                  connection
                );
              }
              let statusEdit =  {
                machine_id: cndy.id.toString(),
                is_soldout: cndy.state.isSoldOut
              }
              await axios.post(`${SERVER_URL}/api/status-edit`, statusEdit)
              setMachine({...machine, ...cndy});
              setProgressState(false);
            } catch (e) {
              console.log("Problem getting candy machine state");
              console.log(e);
              setProgressState(false);
            }
          } else {
            console.log("No candy machine detected in configuration.");
            setProgressState(false);
          }
    })();
    
  }

  const handleMintingClose = () => {
    setMintingOpen(false);
  }
    return (
    <>
      <Modal
        open={mintingOpen}
        onClose={handleMintingClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={mintingModalStyle}>
          <Typography >
            <Grid item xs={12}>
              <div className="minting_refresh_header">
                <div className="modal_minting">{props.machine_type}</div>
                {/* <div>
                  <IconButton aria-label="refresh" className="icon_btn">
                    <RefreshIcon />
                  </IconButton>
                </div> */}
              </div>
            </Grid>
            {progressState == true &&
              <Grid item xs={12}>
                <div className="modal_progress_container">
                  <CircularProgress className="modal_progress"/>
                </div>
                <div className="close_btn_container">
                  <Button onClick={handleMintingClose} className="card_btn">CLOSE</Button>
                </div>
              </Grid>
            }
            {progressState == false &&
              <Grid item xs={12}>
                <div className="minting_list">
                  Available: {machine ? `${machine.state.itemsRemaining}/${machine?.state.itemsAvailable}` : ''}
                </div>
                <div className="minting_list">
                  Collection Name: {machine ? props.machine.machine_collection : ''}
                </div>
                <div className="minting_list">
                  Machine Id: {machine ? <DivPublicKey>{props.machine.machine_id}</DivPublicKey> : ''}
                  {machine && <CopyToClipboard>
                    {({ copy }) => (
                      <IconButton
                      onClick={() => copy(props.machine.machine_id.toString())}
                      >
                        <AssignmentTurnedIn/>
                      </IconButton>
                    )}
                  </CopyToClipboard>}
                  
                </div>
                <div className="minting_list">
                  Price: {machine ? machine.state.price.toNumber() / LAMPORTS_PER_SOL : ''}
                </div>
                
                <div className="minting_list">
                  Start date: {machine ? toDate(machine.state.goLiveDate)?.toString() : ''}
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
                <div className="minting_btn_container">
                  {progressState == false &&
                    <>
                      <Button onClick={handleOneMint} variant="contained" className="card_contain_btn">MINT</Button>
                      <Button onClick={handleBeforeMultiMint} variant="outlined" className="card_outline_btn">MINT AUTO</Button>
                      <Button onClick={handleAfterMultiMint} variant="outlined" className="card_outline_btn">M.A.I</Button>
                    </>
                  }
                  <Button onClick={handleMintingClose} className="card_btn">CLOSE</Button>
                </div>
              </Grid>
            }
          </Typography>
        </Box>
      </Modal>
      <Grid item container md={12} alignItems="center" direction="row" className={`${styles.item} ${classes.item}`}>
        <Grid item container md={6} alignItems="center" direction="row" spacing={2}>
          <Grid item md={3}>
            <div className={`imageWrapper`}>
              <div className={`imageOver`}>
                <img src={props.machine.image_url} alt="NFT IMAGE"></img>
              </div>
            </div>
          </Grid>
          <Grid item md={9}>
            <Typography variant="body1" className={`text-left`}>
              {props.machine.machine_collection}
            </Typography>
            <Typography variant="body2" className={`text-left`}>
              {props.machine.price} sol
            </Typography>
            <Typography variant="body2" className={`text-left`}>
              {props.machine.go_live_date}
            </Typography>
            <Typography variant="body2" className={`text-left`}>
              ID: {props.machine.machine_id}
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={4}>

        </Grid>
        <Grid item md={2}>
          <Button className={`customBtn ${styles.openMint}`} variant="contained"  onClick={() => {handleMintingOpen()}}>
              Open Mint
          </Button>
        </Grid>
      </Grid>
    </>
      
    )
  }
  