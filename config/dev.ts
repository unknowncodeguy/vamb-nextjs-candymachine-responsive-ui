import { Home, Info, Save, Whatshot } from "@material-ui/icons"

const ENVIRONMENT = "development";
const SERVER_URL = "http://localhost:5000";
const MULTI_MINT_COUNT = 3;
const CREATOR_ADDRESS = "5NUMVfUjBNW7bxtTFgJRkXRqhrwZAzkhNUM89dMYL4aa";
const ALLOWED_NFT_NAME = "Candy Cane";
const CUSTOM_RPC_KEY = {
    RPC: `gengesys`,
    URL: `vamb-custom-url`
};

const PAGES = [
    {
      id: 1,
      relativeUrl: '/mint',
      pageTitle: 'MINT',
      icon: Home
    },
    {
      id: 2,
      relativeUrl: '/guide',
      pageTitle: 'GUIDE',
      icon: Save
    },
    {
      id: 3,
      relativeUrl: '/market',
      pageTitle: 'MARKET',
      icon: Whatshot
    },
    {
      id: 4,
      relativeUrl: '/twitter',
      pageTitle: 'TWITTER',
      icon: Info
    },  {
      id: 5,
      relativeUrl: '/settings',
      pageTitle: 'SETTINGS',
      icon: Info
    }
  ]

export {
    ENVIRONMENT,
    SERVER_URL,
    MULTI_MINT_COUNT,
    CREATOR_ADDRESS,
    ALLOWED_NFT_NAME,
    CUSTOM_RPC_KEY,
    PAGES
}