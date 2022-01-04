import {
  SmartContract,
  Address,
  ProxyProvider,
  ContractFunction,
  Transaction,
  TransactionPayload,
  GasLimit,
  IDappProvider,
  AddressValue,
  U64Value,
  TokenIdentifierValue,
} from "@elrondnetwork/erdjs";
import BigNumber from "bignumber.js";

export default class MasterChef {
  contract: SmartContract;
  proxyProvider: ProxyProvider;
  signerProvider?: IDappProvider;

  constructor(
    contractAddress = "",
    provider: ProxyProvider,
    signer?: IDappProvider,
  ) {
    const address = new Address(contractAddress);
    this.contract = new SmartContract({ address });
    this.proxyProvider = provider;
    this.signerProvider = signer;
  }

  async getTotalAllocPoint(): Promise<BigNumber> {
    const func = new ContractFunction("getTotalAllocPoint");
    return this.contract
      .runQuery(this.proxyProvider, {
        func,
      })
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, "base64").toString("hex");
        return new BigNumber(parseInt(decoded, 16) || 0);
      })
      .catch(() => {
        return new BigNumber(0);
      });
  }

  async deposit(): Promise<boolean> {
    if (!this.signerProvider) {
      throw new Error(
        "You need a singer to send a transaction, use either WalletProvider or LedgerProvider",
      );
    }

    this.depositWalletProvider();

    return true;
  }

  private async depositWalletProvider(): Promise<boolean> {
    const func = new ContractFunction("deposit");
    const payload = TransactionPayload.contractCall().setFunction(func).build();

    const leeaki = new Address(
      "erd1q049n3qp2wc0jra5rd83za69u3ze0we0yqm7ax9hghjsde4jeeyqc78p2s",
    );

    const iron = new TokenIdentifierValue(
      Buffer.from("0x49524F4E2D663539333630", "base64"),
    );

    // const transaction = new Transaction({
    //   receiver: this.contract.getAddress(),
    //   value: undefined,
    //   gasLimit: new GasLimit(10000000),
    //   data: payload,
    // });

    const transaction = this.contract.call({
      func: new ContractFunction("deposit"),
      gasLimit: new GasLimit(5000000),
      args: [
        new U64Value(new BigNumber(0)),
        new AddressValue(leeaki),
        iron,
        new U64Value(new BigNumber(10)),
      ],
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.signerProvider.sendTransaction(transaction);

    return true;
  }
}
