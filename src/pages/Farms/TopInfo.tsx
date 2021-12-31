import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { masterchefContractAddress, rewardFundContractAddress } from "config";
import Denominate from "./../../components/Denominate";

const TopInfo = () => {
  const {
    address,
    account: { balance },
  } = Dapp.useContext();

  return (
    <div className="text-white" data-testid="topInfo">
      <div className="mb-1">
        <span className="opacity-6 mr-1">Your address:</span>
        <span data-testid="accountAddress"> {address}</span>
      </div>
      <div className="mb-1">
        <span className="opacity-6 mr-1">Masterchef address:</span>
        <span data-testid="contractAddress"> {masterchefContractAddress}</span>
      </div>
      <div className="mb-4">
        <span className="opacity-6 mr-1">Fund address:</span>
        <span data-testid="contractAddress"> {rewardFundContractAddress}</span>
      </div>
      <div>
        <h3 className="py-2">
          <Denominate value={balance} dataTestId="balance" />
        </h3>
      </div>
    </div>
  );
};

export default TopInfo;
