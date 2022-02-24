import React from "react"

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Menu, Typography } from "@material-ui/core";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { Layout } from '../../components/templates';
import { UpcomingMint } from "../../components/molecules/UpcomingMint";

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

const App = (props: any) => {
  const classes = useStyles(props)

  return (
    <Layout className={classes.root}>
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
                  value={`v2`}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {console.log(event.target.value)}}
                  label="Age"
                >
                  <MenuItem value={`v1`}>Candy V1</MenuItem>
                  <MenuItem value={`v2`}>Candy V2</MenuItem>
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
                placeholder={'CANDY MACHINE ID'}
              />
            </FormControl>
          </Grid>

          <Grid item md={2} className={`text-center`}>  
            <Typography variant="caption" className={`text-left`}>
              &nbsp;
            </Typography>
            <Button className={`${classes.openMint}`} variant="contained" color="primary" onClick={() => {console.log(`Open Mint`)}}>
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
                  value={`v2`}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {console.log(event.target.value)}}
                  label="Age"
                >
                  <MenuItem value={`v1`}>Candy V1</MenuItem>
                  <MenuItem value={`v2`}>Candy V2</MenuItem>
                </Select>
            </FormControl>
          </Grid>

          <Grid item md={4} className={`text-center`}>
            <FormControl variant="outlined" size="small" className={`${classes.search}`}>
              <OutlinedInput
                type={`text`}
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
            Array(5).fill(null).map((value, index) => {
              return <UpcomingMint key={index}>

                     </UpcomingMint>
            })
          }
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>

        <Grid container alignItems="center" spacing={3} direction="row">
          <Grid item md={4} className={`text-center`}></Grid>
          <Grid item md={4} className={`text-center`}>
            <Button className={`${styles.openMint}`} variant="contained" color="primary" onClick={() => {console.log(`Open Mint`)}}>
                LOAD MORE
            </Button>
          </Grid>
          <Grid item md={4} className={`text-center`}></Grid>
        </Grid>
      </>
    </Layout>
  );
};

export default App;