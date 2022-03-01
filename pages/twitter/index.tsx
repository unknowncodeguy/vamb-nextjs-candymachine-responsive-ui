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
    root: {}
  })
)

const Twitter = (props: any) => {
  const classes = useStyles(props)

  useEffect(() => {
    (async () => {

    })();
  }, []);

  return (
    <Layout className={classes.root}>
      <>
      
      </>
    </Layout>
  );
};

export default Twitter;