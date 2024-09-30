import { PriceFetcher } from "../typechain-types";
import { PRICE_FETCHER } from "./constants/BlastSepolia";
import { getContractAt } from "./utils/helpers";

async function main() {
  try {
    const fetcher = await getContractAt<PriceFetcher>("PriceFetcher", PRICE_FETCHER);

    const tx = await fetcher.change_USDC('0x4200000000000000000000000000000000000022'); // need to check
    console.log("Change Usdc Successfully--------->", tx);
  } catch (error) {
    console.error("Error fetching price:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
