import React, { useEffect, useState } from "react";

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Typography } from "@material-ui/core";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Snackbar from '@material-ui/core/Snackbar'
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Layout } from '../../components/templates';

import { AlertState } from '../../utils/utils';
import {CUSTOM_RPC_KEY} from './../../config/prod';

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

const Settings = (props: any) => {
  const classes = useStyles(props);

  const [rpcurl, setRpcurl] = useState(``);
  const [rpcmode, setRpcmode] = useState(``);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  useEffect(() => {
    (async () => {
      setRpcurl(localStorage.getItem(CUSTOM_RPC_KEY.URL) || ``);
      setRpcmode(localStorage.getItem(CUSTOM_RPC_KEY.RPC) || ``);
    })();
  }, []);

  const setRPC = (event: any) => {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    const validate = !!pattern.test(rpcurl);

    if(!validate || !rpcmode) {
      setAlertState({
        open: true,
        message: 'Incorrect Input',
        severity: 'error'
      })
    }
    else {
      localStorage.setItem(CUSTOM_RPC_KEY.URL, rpcurl);
      localStorage.setItem(CUSTOM_RPC_KEY.RPC, rpcmode);
      setAlertState({
        open: true,
        message: 'Registration successed!',
        severity: 'success'
      })
    }
  }

  const setRpcUrl = (event: any) => {
    setRpcurl(event.target.value);
  }

  const setRpcMode = (event: any) => {
    setRpcmode(event.target.value);
  }

  return (
    <Layout className={classes.root}>
      <>
        <Grid container alignItems="center" direction="row" spacing={3}>
          <Grid item md={2} className={`text-center`}>
            <Typography variant="caption" className={`text-left`}>
              RPC
            </Typography>

            <FormControl variant="outlined" className={`${classes.machineVersion}`} size="small">
                <Select
                  value={rpcmode}
                  onChange={setRpcMode}
                >
                  <MenuItem value={`genesys`}>Genesys</MenuItem>
                </Select>
            </FormControl>
          </Grid>

          <Grid item md={8} className={`text-center`}>
            <Typography variant="caption" className={`text-left`}>
              CUSTOM RPC
            </Typography>

            <FormControl variant="outlined" size="small" className={`${classes.search}`}>
              <OutlinedInput
                type={`url`}
                onChange={setRpcUrl}
                placeholder={'https://example.com"'}
                value={rpcurl}
              />
            </FormControl>
          </Grid>          
          <Grid item md={2} className={`text-center`}>  
            <Typography variant="caption" className={`text-left`}>
              &nbsp;
            </Typography>
            <Button className={`col-12 customBtn`} variant="contained" onClick={setRPC}>
              Set RPC URL
            </Button>
          </Grid>
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
      </>
    </Layout>
  );
};

export default Settings;