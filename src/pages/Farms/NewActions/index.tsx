import React, { useCallback, useEffect, useMemo } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import {
  Address,
  ContractFunction,
  BigUIntValue,
  SmartContract,
  SmartContractAbi,
  DefaultInteractionRunner,
  StrictChecker,
} from "@elrondnetwork/erdjs";
import { loadAbiRegistry } from "@elrondnetwork/erdjs/out/testutils";
import BigNumber from "bignumber.js";
import { masterchefContractAddress } from "config";
import MasterChef from "contracts/MasterChef";

const Actions = () => {
  const { dapp, network } = Dapp.useContext();

  const chef = useMemo(() => {
    return new MasterChef(masterchefContractAddress, dapp.proxy, dapp.provider);
  }, [dapp.provider, dapp.proxy]);

  useEffect(() => {
    chef.getTotalAllocPoint().then((data) => {
      console.log("Total Alloc Point", data.toNumber());
    });
  }, [chef]);

  const getPoolInfo = useCallback(async () => {
    const checker = new StrictChecker();
    const runner = new DefaultInteractionRunner(checker, network, dapp.proxy);

    const abiRegistry = await loadAbiRegistry(["/masterchef.abi.json"]);
    const abi = new SmartContractAbi(abiRegistry, ["MasterChef"]);

    const contract = new SmartContract({
      address: new Address(masterchefContractAddress),
      abi,
    });

    const result = await contract.runQuery(dapp.proxy, {
      func: new ContractFunction("getPoolInfo"),
      args: [new BigUIntValue(new BigNumber(0))],
    });

    result.setEndpointDefinition(abi.getEndpoint("getPoolInfo"));

    console.log("result", result);

    // const getPoolInfoInteraction = await contract.methods.getPoolInfo([100]);
    // console.log("getPoolInfoInteraction", getPoolInfoInteraction);
    // const {
    //   returnCode: infoReturnCode,
    //   values: infoReturnValues,
    //   firstValue: infoFirstValue,
    // } = await runner.runAwaitExecution(
    //   getPoolInfoInteraction.withNonce(alice.getNonceThenIncrement()),
    // );
    // const resultParser = await runner.runQuery(getPoolInfoInteraction);
    // console.log("resultParser", resultParser);
  }, [dapp.proxy, network]);

  useEffect(() => {
    getPoolInfo();
  }, [getPoolInfo]);

  const deposit = useCallback(async () => {
    console.log(
      "deposit...",
      dapp.provider.isInitialized(),
      dapp.provider.isConnected(),
    );
    chef
      .deposit()
      .then(() => {
        console.log("Deposit success!");
      })
      .catch(() => {
        console.log("Deposit failed!");
      });
  }, [chef, dapp.provider]);

  return (
    <div className="d-flex mt-4 justify-content-center">
      Hello action
      <button onClick={deposit}>Deposit</button>
    </div>
  );
};

export default Actions;
