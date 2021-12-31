import React, { useCallback, useEffect } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import {
  Address,
  AddressValue,
  ContractFunction,
  Query,
  BigUIntValue,
  AbiRegistry,
  SmartContract,
  QueryResponse,
  SmartContractAbi,
  StructType,
  BinaryCodec,
  Interaction,
  GasLimit,
  DefaultInteractionRunner,
  StrictChecker,
  Nonce,
} from "@elrondnetwork/erdjs";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { masterchefContractAddress } from "config";
import { RawTransactionType } from "helpers/types";
import useNewTransaction from "pages/Transaction/useNewTransaction";
import { routeNames } from "routes";
import BigNumber from "bignumber.js";
import {
  extendAbiRegistry,
  loadAbiRegistry,
} from "@elrondnetwork/erdjs/out/testutils";
import MasterchefABI from "../../../abis/masterchef.abi.json";

const Actions = () => {
  const sendTransaction = Dapp.useSendTransaction();
  const { address, dapp, network } = Dapp.useContext();
  const newTransaction = useNewTransaction();

  useEffect(() => {
    const query = new Query({
      address: new Address(masterchefContractAddress),
      func: new ContractFunction("getTotalAllocPoint"),
      args: [],
    });
    dapp.proxy.queryContract(query).then(({ returnData }) => {
      const [encoded] = returnData;
      const decoded = Buffer.from(encoded, "base64").toString("hex");
      console.log("TotalAllocPoint:", parseInt(decoded, 16));
    });
  }, []);

  useEffect(() => {
    test();
  }, []);

  const test = useCallback(async () => {
    const abiRegistry = await loadAbiRegistry(["/masterchef.abi.json"]);
    const abi = new SmartContractAbi(abiRegistry, ["MasterChef"]);
    const contract = new SmartContract({
      address: new Address(masterchefContractAddress),
      abi,
    });

    const getLotteryInfoInteraction = contract.methods
      .getPoolInfo([new BigUIntValue(new BigNumber(0))])
      .withGasLimit(new GasLimit(5000000));
    const checker = new StrictChecker();

    const runner = new DefaultInteractionRunner(checker, undefined, dapp.proxy);

    const x = await Promise.all([
      runner.runAwaitExecution(
        getLotteryInfoInteraction.withNonce(new Nonce(16)),
      ),
    ]);

    const a = getLotteryInfoInteraction.buildTransaction().getData().toString();
    console.log("a", a);
    // contract
    //   .runQuery(dapp.proxy, {
    //     func: new ContractFunction("getPoolInfo"),
    //     args: [new BigUIntValue(new BigNumber(0))],
    //   })
    //   .then(({ returnData }) => {
    //     const [encoded] = returnData; // encoded struct
    //     const decoded = Buffer.from(encoded, "base64").toString("UTF-8");
    //     console.log("decoded", decoded);
    //     // const values = codec.decodeTopLevel(decoded); // error
    //     // console.log("values:", values);
    //   })
    //   .catch((err) => {
    //     console.error("Unable to call VM query", err);
    //   });
  }, []);

  return <div className="d-flex mt-4 justify-content-center">Hello action</div>;
};

export default Actions;
