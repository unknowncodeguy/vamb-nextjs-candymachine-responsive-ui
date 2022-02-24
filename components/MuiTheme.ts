import { createTheme } from "@material-ui/core/styles"

/**
 * material-ui theme color pallete
 * @see https://material-ui.com/style/color/
 */

export const LightTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: `#42427D`,
      light: `#FFFFFF`,
      dark: `#42427D`
    },
    text: {
      primary: `#42427D`,
      secondary: `#42427D`
    },
    background: {
      paper: `#FFFFFF`,
      default: "#F7FAFF"
    }
  },
})

export const DarkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: `#42427D`,
      light: `#42427D`,
      dark: `#FFFFFF`
    },
    text: {
      primary: `#42427D`,
      secondary: `#FFFFFF`
    },
    background: {
      paper: `#FFFFFF`,
      default: "#5840BB"
    }
  },
});
