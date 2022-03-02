import React, { useEffect, useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/router";

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { RootState } from "./../../redux/store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setTheme } from "../../redux/slices/counterSlice";

import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles"
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import { Sidenavi } from "./../organisms";
import {PAGES} from './../../config/prod';

import styles from './styles/ResponsiveDrawer.module.scss'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },
    logoImage: {
      backgroundColor: theme.palette.primary.dark
    },
    logoWrap: {
      backgroundColor: theme.palette.primary.light
    },
    halfCircle: {
      backgroundImage: `linear-gradient(0deg, ${theme.palette.primary.dark} 50%, transparent 50%)`
    },
    title: {
      color: theme.palette.text.secondary,
    },
    copyright: {
      color: theme.palette.text.secondary,
    },
    search: {
      width: `100%`,
      border: `none`,
      background: theme.palette.background.default,
      borderRadius: `20px 5px`,
      "& *": {
        border: `none`,
        color: theme.palette.primary.dark
      }
    },
    colorToggle: {

    }
  })
)

type Props = {
  children: React.ReactNode
}

/**
 * Responsive drawer
 * @see https://material-ui.com/demos/drawers/#responsive-drawer
 */
export const ResponsiveDrawer = function (props: Props) {
  const { children } = props;
  const classes = useStyles(props);
  const theme = useTheme();
  const wallet = useAnchorWallet();
  const router = useRouter();

  
  const dispatch = useAppDispatch();
  const mainTheme = useAppSelector((state: RootState) => state.isOwner.theme);

  const setPageName = () => {
  
    for(let page of PAGES) {
      if((router.pathname == `/collection/[id]` && page.relativeUrl == `/market`) || router.pathname == page.relativeUrl) {
        return page.pageTitle;
      }
    }
  }

  const changeTheme = () => {
    localStorage.setItem(`vamb-theme`, mainTheme == `light`? `dark` : `light`);
    dispatch(setTheme( mainTheme == `light`? `dark` : `light` ));
  }
  return (
    <div className={`d-flex  ${styles.container}`}>
      <aside className={`d-flex ${styles.sideMenu}`}>
        <Link href="/">
          <a>
            <div className={`${styles.logo}`}>
              <div className={`d-flex align-items-center`}>
                {/* <div className={`${styles.logoImage} ${classes.logoImage}`}>
                  <div className={`${styles.logoWrap} ${classes.logoWrap}`}>
                    <div className={`${styles.halfCircle} ${classes.halfCircle}`}>

                    </div>
                  </div>
                </div> */}
                <Typography variant="h4" className={`${classes.title}`}>{`VAMB`}</Typography>
              </div>
            </div>
          </a>
        </Link>

        <div className={`${styles.menu}`}>
          <div className={`${styles.menuWrapper}`}>
            <Sidenavi />
          </div>
        </div>

        <div className={`${classes.copyright} ${styles.copyright}`}>
          <small>©Copyright 2022</small>
        </div>

      </aside>

      <section className={`${styles.pageContainer}`}>
        <div className={`${styles.pageWrapper}`}>

          <nav className={`${styles.appBar}`}>
            <div className={`${styles.appBarWrapper}`}>
              <Grid container alignItems="center" direction="row">
                {/* <Hidden mdUp>
                  <Grid item xs={1} sm={1} md={1} lg={1}>
                    <IconButton
                      aria-label="Open drawer"
                      className={`text-left ${styles.hamburger}`}
                    >
                      <MenuIcon />
                   </IconButton>
                  </Grid>
                </Hidden> */}
                <Grid item md={4}>
                  <Typography variant="h5" className={``}>{setPageName()}</Typography>
                </Grid>
                <Grid item md={5}></Grid>
                {/* <Hidden mdDown>
                  <Grid item xs={2} sm={2} md={2}>
                  </Grid>
                </Hidden> */}
                <Grid item xs={1} sm={1} md={1} className="text-center">
                  <IconButton color="inherit" onClick={changeTheme}>
                    {theme.palette.type === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Grid>
                
                <Grid item xs={2} sm={2} md={2} lg={2}>
                   <Typography variant="h6" className={`text-right ${styles.textWalletKey}`}>
                     {wallet&& `${wallet.publicKey.toString().substring(0,6)}...${wallet.publicKey.toString().slice(-6)}`}
                    </Typography>
                </Grid>
              </Grid>
            </div>
          </nav>

          <section className={`${styles.content}`}>
            {children}
          </section>

        </div>
      </section>
    </div>
  )
}
