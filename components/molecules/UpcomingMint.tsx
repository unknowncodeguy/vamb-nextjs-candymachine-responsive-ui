import React from "react";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";


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
  
  /**
   * Next.js optimized <ListItem>
   * @param props Any
   */
  export const UpcomingMint = function (props: any) {
    const classes = useStyles(props)

    return (
      <Grid item container md={12} alignItems="center" direction="row" className={`${styles.item} ${classes.item}`}>
        <Grid item container md={6} alignItems="center" direction="row" spacing={2}>
          <Grid item md={3}>
            <div className={`imageWrapper`}>
              <div className={`imageOver`}>
                <img src="https://cdn.magiceden.io/rs:fill:320:320:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/61e29dd1f0a00558d97bb060c1f28d06/ffbd0db4" alt="NFT IMAGE"></img>
              </div>
            </div>
          </Grid>
          <Grid item md={9}>
            <Typography variant="body1" className={`text-left`}>
              {`EXAMPLE MINT`}
            </Typography>
            <Typography variant="body2" className={`text-left`}>
              {`0.6`} sol
            </Typography>
            <Typography variant="body2" className={`text-left`}>
              {`5th Febrary 2021 12:00:00 UTC`}
            </Typography>
            <Typography variant="body2" className={`text-left`}>
              ID: {`9xsc...SWRR`}
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={4}>

        </Grid>
        <Grid item md={2}>
          <Button className={`${styles.openMint}`} variant="contained" color="primary" onClick={() => {console.log(`Open Mint`)}}>
              Open Mint
          </Button>
        </Grid>
      </Grid>
    )
  }
  