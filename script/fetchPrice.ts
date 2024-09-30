import { PriceFetcher } from "../typechain-types";
import { PRICE_FETCHER } from "./constants/BlastSepolia";
import { getContractAt } from "./utils/helpers";

async function main() {
  try {
    const fetcher = await getContractAt<PriceFetcher>("PriceFetcher", PRICE_FETCHER);
    const offset = 0; // Tokens to hop
    const srcLength = 9; // Check against length of General Tokens

    const tx = await fetcher.fetchPrices(srcLength, offset); // need to check
    console.log("Fetched Price Successfully--------->", tx);
  } catch (error) {
    console.error("Error fetching price:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
