const ENVIRONMENT = "production";
const SERVER_URL = "https://cmbot-3dboogles-server-tomas.herokuapp.com";
const MULTI_MINT_COUNT = 20;
const LOAD_COUNT = 12;
const LAMPORT = 1000000000;

const CREATOR_ADDRESS = "EWDhTeWbT4tnW7YHbPmWRct3h3vGfEcaeLxqFGwejdyg";
const ALLOWED_NFT_NAME = "VAMB";
const CORS_PROXY_API = `https://magiceden.boogle-cors.workers.dev?u=`;
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
export {
    CORS_PROXY_API,
    RELICS_API,
    MAGICEDEN_API,
    ENVIRONMENT,
    SERVER_URL,
    MULTI_MINT_COUNT,
    CREATOR_ADDRESS,
    ALLOWED_NFT_NAME,
    LAMPORT,
    LOAD_COUNT
}