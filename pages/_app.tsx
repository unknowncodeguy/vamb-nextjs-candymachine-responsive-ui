import "../styles/normalize.css";
import "../styles/utils.css";
import "../styles/fonts.css";
import "../styles/app.css";

import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Provider as ReduxProvider } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/styles"
import { store,RootState } from "../redux/store"
import { LightTheme, DarkTheme } from "../components/MuiTheme";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setTheme } from "../redux/slices/counterSlice";

import { WalletBalanceProvider } from "../hooks/useWalletBalance";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnectionProvider = dynamic(
  () => import("../components/WalletConnection/WalletConnectionProvider"),
  {
    ssr: false,
  }
);

export function Wrapper({ Component, pageProps }: any){
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);
  const dispatch = useAppDispatch();

  let mainTheme = LightTheme;
  if(theme == ``) {
    if(localStorage.getItem(`vamb-theme`)) {
      if(localStorage.getItem(`vamb-theme`) == `dark`) {
        mainTheme = DarkTheme;
        dispatch(setTheme( `dark` ));
      }
      else{
        dispatch(setTheme( `light` ));
      }
    }
    else {
      localStorage.setItem(`vamb-theme`, 'light');
      dispatch(setTheme( `light` ));
    }
  }
  else {
    if(theme == `dark`) {
      mainTheme = DarkTheme;
    }
  }

  return (
    <ThemeProvider theme={mainTheme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  )

}

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WalletConnectionProvider>
      <ReduxProvider store={store}>
        <WalletBalanceProvider>
          <Wrapper pageProps={pageProps} Component={Component}></Wrapper>
        </WalletBalanceProvider>
      </ReduxProvider>
    </WalletConnectionProvider>
  );
}
export default MyApp;
