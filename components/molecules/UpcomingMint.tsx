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
          <Button className={`${styles.openMint}`} variant="contained" color="primary" onClick={() => {console.log(`Open Mint`)}}>
              Open Mint
          </Button>
        </Grid>
      </Grid>
    )
  }
  