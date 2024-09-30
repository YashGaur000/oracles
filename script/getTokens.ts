import { PriceFetcher } from "../typechain-types";
import { PRICE_FETCHER } from "./constants/BlastSepolia";
import { getContractAt } from "./utils/helpers";

async function main() {
  try {
    const fetcher = await getContractAt<PriceFetcher>(
      "PriceFetcher",
      PRICE_FETCHER
    );

    const connectedTokens = await fetcher.get_tokens(true);

    console.log("Connected Tokens--------->", connectedTokens);

    const generalTokens = await fetcher.get_tokens(false);

    console.log("General Tokens--------->", generalTokens);
  } catch (error) {
    console.error("Error getting tokens:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
