import * as React from "react"
import Head from "next/head"

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

import { ResponsiveDrawer } from "../organisms";

import styles from './Layout.module.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
    },
  })
)

type Props = {
  children: React.ReactNode
  className?: string
}

export const Layout = function (props: Props) {
  const { children, className } = props
  const classes = useStyles(props)

  return (
    <main className={`${classes.root} ${styles.main}`}>
      <Head>
        {/* <title>{selectedPage.title}</title> */}
        <title> VAMB </title>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>

      <ResponsiveDrawer>
        <>{children}</>
      </ResponsiveDrawer>
    </main>
  )
}
