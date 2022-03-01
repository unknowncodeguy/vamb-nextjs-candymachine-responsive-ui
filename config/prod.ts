import { Dashboard, EventNote, Twitter, Settings, LocalGroceryStore  } from "@material-ui/icons"

const ENVIRONMENT = "production";
const SERVER_URL = "https://cmbot-3dboogles-server-tomas.herokuapp.com";
const MULTI_MINT_COUNT = 20;
const LOAD_COUNT = 12;
const LAMPORT = 1000000000;

const UPDATEAUTHORITY_ADDRESS = "6JhtEWtTzxKnRgkR6RhgRbLB43CvRQBcWC1Tuexe3Nwk";
const ALLOWED_NFT_NAME = "VAMB";
const CORS_PROXY_API = `https://angle.boogle-cors.workers.dev?u=`;
const MAGICEDEN_API = {
    POPULAR_COLLECTION : 'https://api-mainnet.magiceden.io/popular_collections?timeRange=1d&edge_cache=true',
    NEW_COLLECTION: `https://api-mainnet.magiceden.io/new_collections`,
    ALL_COLLECTION: `https://api-mainnet.magiceden.io/all_collections_with_escrow_data`,
    COLLECTION: `https://api-mainnet.magiceden.io/collections/`,
    COLLECTION_DETAIL: `https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/`,
    NFTS: `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q=`,
    ITEMDETAIL:`https://api-mainnet.magiceden.io/rpc/getGlobalActivitiesByQuery?q=`,
    BUY_V2: `https://api-mainnet.magiceden.io/v2/instructions/buy_now?`,
};
const RELICS_API = {
    STAT: `https://app.relics.ai/api4/stats`,
    PROGRAM: `https://ssc-dao.genesysgo.net/`
};

const CUSTOM_RPC_KEY = {
    RPC: `mode`,
    URL: `vamb-custom-url`
};

const PAGES = [
    {
      id: 1,
      relativeUrl: '/mint',
      pageTitle: 'MINT',
      icon: Dashboard
    },
    {
      id: 2,
      relativeUrl: '/guide',
      pageTitle: 'GUIDE',
      icon: EventNote
    },
    {
      id: 3,
      relativeUrl: '/market',
      pageTitle: 'MARKET',
      icon: LocalGroceryStore
    },
    {
      id: 4,
      relativeUrl: '/twitter',
      pageTitle: 'TWITTER',
      icon: Twitter
    },  {
      id: 5,
      relativeUrl: '/settings',
      pageTitle: 'SETTINGS',
      icon: Settings
    }
  ]
export {
    CORS_PROXY_API,
    RELICS_API,
    MAGICEDEN_API,
    ENVIRONMENT,
    SERVER_URL,
    MULTI_MINT_COUNT,
    UPDATEAUTHORITY_ADDRESS,
    ALLOWED_NFT_NAME,
    LAMPORT,
    LOAD_COUNT,
    CUSTOM_RPC_KEY,
    PAGES
}