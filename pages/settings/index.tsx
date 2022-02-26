import React, { useEffect, useState } from "react";

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Typography } from "@material-ui/core";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Layout } from '../../components/templates';

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
  const classes = useStyles(props)

  useEffect(() => {
    (async () => {

    })();
  }, []);

  return (
    <Layout className={classes.root}>
      <>
        <Grid container alignItems="center" direction="row" spacing={3}>
          <Grid item md={1} className={`text-center`}>
            
          </Grid>
          <Grid item md={2} className={`text-center`}>
            <Typography variant="caption" className={`text-left`}>
              RPC
            </Typography>

            <FormControl variant="outlined" className={`${classes.machineVersion}`} size="small">
                <Select
                  value={`genesys`}
                  onChange={() => {}}
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
                type={`text`}
                onChange= {() => {}}
                placeholder={'Leave Blank Default'}
              />
            </FormControl>
          </Grid>          
          <Grid item md={1} className={`text-center`}>

          </Grid>
        </Grid>
      </>
    </Layout>
  );
};

export default Settings;