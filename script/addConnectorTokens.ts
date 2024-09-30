import { PriceFetcher } from "../typechain-types";
import { getContractAt } from "./utils/helpers";
import { PRICE_FETCHER, connectors } from "./constants/BlastSepolia";

async function main() {
  try {
    const fetcher = await getContractAt<PriceFetcher>(
      "PriceFetcher",
      PRICE_FETCHER
    );

    const { isConnected, tokens } = connectors;

    const tx = await fetcher.add_tokens(isConnected, tokens);

    console.log("Added Tokens on Tx Hash-------->", tx.hash);
  } catch (error) {
    console.error("Error Adding tokens:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
