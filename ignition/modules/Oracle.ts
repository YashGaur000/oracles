import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const POOL_FACTORY= "0xaC0d857442DA4f1541F4F737DA3351E292a688B8" // Add the POOL FACTORY ADDRESS

const OracleModule = buildModule("OracleModule", (m) => {
  const poolFactory = m.getParameter("factoryV2", POOL_FACTORY);
 

  const oracle = m.contract("TenexOracle",[poolFactory]); // addr : 0xe7AAd81393675f8CfD7DCf7a9992443F6847d6B6

  return { oracle };
});

export default OracleModule;
