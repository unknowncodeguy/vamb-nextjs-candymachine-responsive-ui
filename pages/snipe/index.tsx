import React, { useEffect, useState } from "react";

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
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

const Snipe = (props: any) => {
  const classes = useStyles(props);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  useEffect(() => {
    (async () => {

    })();
  }, []);

  return (
    <Layout className={classes.root}>
      <>
        <Grid container alignItems="center" direction="row" spacing={3}>
          <Grid item md={2}></Grid>
          <Grid item  md={2}>
            TOKEN ADDRESS
          </Grid>
          <Grid item  md={6}>
            <FormControl variant="outlined" size="small" className={`${classes.search}`}>
              <OutlinedInput
                type={`text`}
              />
            </FormControl>
          </Grid>
          <Grid item md={2}></Grid>

          <Grid item md={2}></Grid>
          <Grid item  md={2}>
            PRICE
          </Grid>
          <Grid item  md={3}>
            <TextField
              type="text"
              size="small"
              className={`${classes.machineVersion}`}
              variant={`outlined`}
              style={{width: '100%'}}
            />
          </Grid>
          <Grid item md={5}></Grid>

          <Grid item md={2}></Grid>
          <Grid item  md={2}>
            NUMBER
          </Grid>
          <Grid item  md={3}>
            <TextField
              type="number"
              size="small"
              className={`${classes.machineVersion}`}
              variant={`outlined`}
              style={{width: '100%'}}
            />
          </Grid>
          <Grid item md={5}></Grid>

          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button className={`customBtn`} variant="contained">
              &nbsp;&nbsp;&nbsp;Token Snipe&nbsp;&nbsp;&nbsp;
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
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

export default Snipe;