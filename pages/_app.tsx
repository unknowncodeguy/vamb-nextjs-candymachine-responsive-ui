import "../styles/normalize.css";
import "../styles/utils.css";
import "../styles/fonts.css";
import "../styles/app.css";

import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Provider as ReduxProvider } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/styles"
import { store } from "../redux/store"
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
  return (
    <WalletConnectionProvider>
      <ReduxProvider store={store}>
        <WalletBalanceProvider>
          <ThemeProvider theme={LightTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </WalletBalanceProvider>
      </ReduxProvider>
    </WalletConnectionProvider>
  );
}
export default MyApp;
