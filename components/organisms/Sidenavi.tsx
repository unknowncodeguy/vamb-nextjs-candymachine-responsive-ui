import React from "react";
import { useRouter } from "next/router";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ListItem } from "../molecules";

import {PAGES} from './../../config/prod';

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

/**
 * Side navigation component
 * @param props Props
 */
export const Sidenavi = function (props: any) {
  const classes = useStyles(props)

  const router = useRouter();
  console.log(router.pathname);
  return (
    <div className={classes.root}>
        {PAGES.map((page) => {
          const Icon = page.icon
          return (
            <ListItem
              key={page.id}
              isSelected={router.pathname == page.relativeUrl || (router.pathname == `/collection/[id]` && page.relativeUrl == `/market`)}
              href={page.relativeUrl}
              pageTitle={page.pageTitle}
              icon={
                <SvgIcon className={`${router.pathname == page.relativeUrl ? classes.active : classes.deactive}`}>
                  <Icon />
                </SvgIcon>
              }
            />
          )
        })}
    </div>
  )
}
