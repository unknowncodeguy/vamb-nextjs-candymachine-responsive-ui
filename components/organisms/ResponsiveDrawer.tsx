import React, { useState } from "react";
import Link from 'next/link'

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles"
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import { Sidenavi } from "./../organisms";

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

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<boolean>(false);
  /**
   * Toggle drawer
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleColorTheme = () => {
    setColorTheme((prevValue) => !prevValue);
  }

  return (
    <div className={`d-flex  ${styles.container}`}>
      <aside className={`d-flex ${styles.sideMenu}`}>
        <Link href="/">
          <a>
            <div className={`${styles.logo}`}>
              <div className={`d-flex align-items-center`}>
                <div className={`${styles.logoImage} ${classes.logoImage}`}>
                  <div className={`${styles.logoWrap} ${classes.logoWrap}`}>
                    <div className={`${styles.halfCircle} ${classes.halfCircle}`}>

                    </div>
                  </div>
                </div>
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
                <Hidden mdUp>
                  <Grid item xs={1} sm={1} md={1} lg={1}>
                    <IconButton
                      aria-label="Open drawer"
                      className={`text-left ${styles.hamburger}`}
                    >
                      <MenuIcon />
                   </IconButton>
                  </Grid>
                </Hidden>
                <Grid item xs={3} sm={3} md={3}>
                  <Typography variant="h5" className={``}>{`Page Name`}</Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}></Grid>
                <Hidden mdDown>
                  <Grid item xs={1} sm={1} md={1}>
                  </Grid>
                </Hidden>
                <Grid item xs={1} sm={1} md={1} className="text-center">
                  <IconButton color="inherit">
                    {theme.palette.type === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <FormControl variant="outlined" size="small" className={`${classes.search}`}>
                    <OutlinedInput
                      type={`text`}
                      placeholder={'Search Collection'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            edge="end"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                   <Typography variant="body1" className={`text-right`}>{`w3tgeS...qweSeS`}</Typography>
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
