import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ORACLE = "0xE8500f6A28B9E0226D8455211515A78C75D13E3C";
const USDB = "0x4200000000000000000000000000000000000022"; // Currency against Price fetched

const PriceFetcherModule = buildModule("PriceFetcherModule", (m) => {
  const oracle = m.getParameter("oracle", ORACLE);
  const usdb = m.getParameter("usdb", USDB);

  const priceFetcher = m.contract("PriceFetcher", [oracle, usdb]);

  //Price Fetcher : 0x4e714737d0c5eD33B8A90ba22938b406a523367D

  return { priceFetcher };
});

export default PriceFetcherModule;
