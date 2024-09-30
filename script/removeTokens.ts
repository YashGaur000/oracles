import { PriceFetcher } from "../typechain-types";
import { getContractAt } from "./utils/helpers";
import { PRICE_FETCHER, general } from "./constants/BlastSepolia";

async function main() {
  try {
    const fetcher = await getContractAt<PriceFetcher>(
      "PriceFetcher",
      PRICE_FETCHER
    );

    const { isConnected, indices } = general;

    const tx = await fetcher.remove_tokens(isConnected, indices);

    console.log("Removed Tokens on Tx Hash-------->", tx.hash);
  } catch (error) {
    console.error("Error Removing tokens:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
