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

const Guide = (props: any) => {
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
          <Grid item md={9} className={`text-center`}>
            <Typography variant="body1" className={`text-left`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac massa quis lectus ornare mollis. In eu magna quam. Vivamus sed leo quam. Fusce iaculis nisl ut nulla interdum dictum. Sed erat magna, iaculis id massa nec, sagittis finibus leo. Cras eget consequat ipsum. Aliquam erat volutpat. Praesent molestie ligula quis purus sagittis, nec rutrum purus vehicula. Maecenas in feugiat purus, vel auctor ex. Aliquam pretium neque nec tincidunt ornare. Phasellus ut placerat lacus. In tristique mi quis tortor molestie porta. Nulla ornare purus in massa vestibulum commodo. Cras libero nisi, lobortis ut bibendum in, convallis in ipsum.
              <br></br>
              <br></br>
              Phasellus non metus neque. Vivamus faucibus porta euismod. In rhoncus diam eget elit facilisis, non tincidunt neque sagittis. Nulla convallis nibh diam, quis auctor arcu pretium eget. Pellentesque et iaculis ante. Cras finibus consequat aliquam. Ut vehicula varius mi rutrum laoreet. Donec at ipsum risus. Phasellus venenatis sapien ante, quis suscipit lacus sagittis ut. Ut eu ante volutpat, aliquet tellus id, rutrum nisl. Nullam sollicitudin sed ipsum pharetra porta. Integer porttitor pellentesque velit, posuere elementum neque porta sit amet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus eros dolor, ultricies a auctor sit amet, dignissim non augue. Duis consequat commodo purus, dignissim pretium ligula ultricies id. Pellentesque eget tortor sit amet neque laoreet molestie sed eu massa.
              <br></br>
              <br></br>
              Donec urna nibh, lacinia vel malesuada at, pharetra in erat. Vivamus nec nisl eget velit mollis scelerisque at et dui. Mauris quis lectus vitae nunc sodales volutpat. Vestibulum tristique ullamcorper lacinia. Integer non ornare purus. Mauris vitae turpis efficitur, pharetra dolor vel, ullamcorper metus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed tempor lectus a fringilla aliquam. Pellentesque lobortis porttitor eros eget bibendum. Etiam eget odio pretium, sollicitudin justo sed, feugiat nulla. Aliquam erat volutpat. Sed vulputate accumsan ornare.
            </Typography>

          </Grid>
         
          <Grid item md={2} className={`text-center`}>

          </Grid>
        </Grid>
      </>
    </Layout>
  );
};

export default Guide;