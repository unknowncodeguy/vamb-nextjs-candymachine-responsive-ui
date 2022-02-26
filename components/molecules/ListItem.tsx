import React from "react";
import Link from "next/link";
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";


  import styles from './ListItem.module.scss'
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {},
      page: {
        color: theme.palette.primary.dark,
      },
      actived: {
        color: theme.palette.primary.main
      },
      item: {
        "&:hover": {
          "& p": {
            textShadow: `0px 0px 8px ${theme.palette.primary.dark}`
          }
        }
      }
    })
  )
  
  type Props = {
    /**
     * <Link href="/">
     */
    href: string
    /**
     * <ListItemText primary="redux"/>
     */
    pageTitle: React.ReactNode
    /**
     * List item icon
     */
    icon: JSX.Element
    /**
     * class
     */
     isSelected?: boolean
    /**
     * onClick event
     */
    // onClick?: (event: React.MouseEvent<HTMLElement>) => void
  }
  
  /**
   * Next.js optimized <ListItem>
   * @param props Props
   */
  export const ListItem = function (props: Props) {
    const { isSelected, href, icon, pageTitle } = props
    const classes = useStyles(props)
    const AvatorIcon = () => icon
    return (
      <Link href={href}>
        <a>
            <div className={`d-flex align-items-center ${classes.item} ${isSelected ? styles.actived : ``} ${styles.item}`}>
                <div className="d-flex align-itens-center">
                    <AvatorIcon />
                </div>
                <Typography variant="body1" className={`${classes.page} ${isSelected ? classes.actived : ``}`}>
                {pageTitle}
                </Typography>
            </div>
        </a>
      </Link>
    )
  }
  