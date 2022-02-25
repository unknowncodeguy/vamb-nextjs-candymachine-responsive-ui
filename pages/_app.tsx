import "../styles/normalize.css";
import "../styles/utils.css";
import "../styles/fonts.css";
import "../styles/app.css";

import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/styles"
import { LightTheme, DarkTheme } from "../components/MuiTheme"

import { WalletBalanceProvider } from "../hooks/useWalletBalance";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnectionProvider = dynamic(
  () => import("../components/WalletConnection/WalletConnectionProvider"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  //const theme = localStorage.vampTheme ? (localStorage.vampTheme == `light` ? LightTheme : DarkTheme) : LightTheme;
  console.log('ssss');
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <ThemeProvider theme={DarkTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  );
}
export default MyApp;
