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

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
const Collection = (props: any) => {
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

        <Grid container spacing={2} className="pt_16" direction="row" justifyContent="center" alignItems="center">
          <Grid item md={2} className=" text-center" >
            <img src={`https://dl.airtable.com/.attachmentThumbnails/102af36cc30fec0b05ebb45406f20971/126d0320`} className={`${classes.collection_image}`} />
          </Grid>
        </Grid>

        <Grid container spacing={2} className="pt_16" direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={12} className="text-center" >
            <Typography variant="h6" >
              THIS IS COLLECTION NAME
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="pt_16" direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={12} className="" >
            <Typography variant="subtitle2">
            {`THISTHIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION!THIS IS DESCRIPTION! IS DESCRIPTION!`}
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
                        12 SOL
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
                      All Time
                    </Typography>
                    <Typography  align='center'>
                      <Typography  align='center' display='inline'>
                        7777
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
                        7777
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
                      7777
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
                      Listed Value
                    </Typography>
                    <Typography  align='center'>
                      <Typography  align='center' display='inline'>
                      1
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
                      1000
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
                      Limit Number
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`mb-16 ${classes.pad}`}>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`mb-8`}>
                    <Typography variant="caption">
                      Limit Number
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`mb-16`}>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`text_center`}>
                    <Button size="small" className={`${classes.btn} ${classes.toppad}`} >
                      Start Sniping
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
                <Grid container direction="row" alignItems="center" className=" mt_8">
                  <Grid item xs={12} sm={12} md={12} className={`${classes.pad}`}>
                    <FormControl variant="outlined" style={{width: '100%'}} size="small">
                        <Select
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>                         
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`${classes.pad}`}>
                    <FormControl variant="outlined" style={{width: '100%'}} size="small">
                        <Select
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>                         
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={`${classes.pad}`}>
                    <FormControl variant="outlined" style={{width: '100%'}} size="small">
                        <Select
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>                         
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} >
                    <FormControl variant="outlined" style={{width: '100%'}} size="small">
                        <Select
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>                         
                  </Grid>
                </Grid>                
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item container spacing={2} xs={12} sm={8} md={9}>
          {
            Array(18).fill(null).map((item: any, index: number) => {
            return  <Grid item xs={6} sm={6} md={4} key={index}>
                      <Card className={classes.collection}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            alt={`NFT NAME`}
                            image={`https://dl.airtable.com/.attachmentThumbnails/102af36cc30fec0b05ebb45406f20971/126d0320`}
                            title={`NFT NAME`}
                            className={classes.collectionImage}
                          />
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} className="">
                                <Typography gutterBottom variant="h6" className={`${classes.nftTitle}`}>
                                  {`NFT NAME`}
                                </Typography>
                                <div className="d_flex align_items_center">
                                  <Typography gutterBottom variant="body1" className={`${classes.nftVerified}`}>
                                    NFT NAME
                                    <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`${classes.nftVerifiedIcon} svg-inline--fa fa-check-circle fa-w-16`}><g className="fa-group"><path className="fa-secondary" fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm155.31 195.31l-184 184a16 16 0 0 1-22.62 0l-104-104a16 16 0 0 1 0-22.62l22.62-22.63a16 16 0 0 1 22.63 0L216 308.12l150.06-150.06a16 16 0 0 1 22.63 0l22.62 22.63a16 16 0 0 1 0 22.62z"></path><path className="fa-primary" fill="currentColor" d="M227.31 387.31a16 16 0 0 1-22.62 0l-104-104a16 16 0 0 1 0-22.62l22.62-22.63a16 16 0 0 1 22.63 0L216 308.12l150.06-150.06a16 16 0 0 1 22.63 0l22.62 22.63a16 16 0 0 1 0 22.62l-184 184z"></path></g></svg>
                                  </Typography>
                                </div>

                                <Typography gutterBottom variant="body2" className={`${classes.nftPrice}`}>
                                  {1} SOL
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                        <CardActions style={{padding: '0px'}}>
                          <Grid container direction="row" alignItems="center" className="" spacing={2} style={{padding: '8px 16px 16px 16px'}}>  
                            <Grid item xs={12} className=" text_right link">
                              <Button onClick={() => {}} size="small" className={`${classes.btn}`}>
                                Quick Buy
                              </Button>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </Card>
                    </Grid>
            })
          }
          </Grid>
        </Grid>


    </Layout>
  );
};

export default Collection;