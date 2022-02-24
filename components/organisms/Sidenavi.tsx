import React from "react";
import { List } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import { Page, SiteInfo } from "./../../constants";
import { ListItem } from "../molecules";

import { Color } from "@material-ui/core"
import { blue, orange, pink, red, teal } from "@material-ui/core/colors"
import { SvgIconProps } from "@material-ui/core/SvgIcon"
import { Home, Info, Save, Whatshot } from "@material-ui/icons"

import styles from './styles/Sidenavi.module.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      
    },
    deactive: {
      color: theme.palette.primary.dark,
      opacity: 0.7
    },
    active: {
      color: theme.palette.primary.main
    }
  })
)

const pages = [
  {
    id: 1,
    relativeUrl: '/mint',
    pageTitle: 'MINT',
    iconColor: pink,
    icon: Home
  },
  {
    id: 2,
    relativeUrl: '/guide',
    pageTitle: 'GUIDE',
    iconColor: blue,
    icon: Save
  },
  {
    id: 3,
    relativeUrl: '/market',
    pageTitle: 'MARKET',
    iconColor: teal,
    icon: Whatshot
  },
  {
    id: 4,
    relativeUrl: '/twitter',
    pageTitle: 'TWITTER',
    iconColor: orange,
    icon: Info
  },  {
    id: 5,
    relativeUrl: '/setting',
    pageTitle: 'SETTINGS',
    iconColor: red,
    icon: Info
  }
]

/**
 * Side navigation component
 * @param props Props
 */
export const Sidenavi = function (props: any) {
  const classes = useStyles(props)

  return (
    <div className={classes.root}>
        {pages.map((page) => {
          const Icon = page.icon
          return (
            <ListItem
              key={page.id}
              isSelected={page.id === 1}
              href={page.relativeUrl}
              pageTitle={page.pageTitle}
              icon={
                <SvgIcon className={`${page.id === 1 ? classes.active : classes.deactive}`}>
                  <Icon />
                </SvgIcon>
              }
            />
          )
        })}
    </div>
  )
}
