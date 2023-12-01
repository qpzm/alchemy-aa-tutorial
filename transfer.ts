import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {LocalAccountSigner, type Hex, Address} from "@alchemy/aa-core";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";

const chain = sepolia;

// The private key of your EOA that will be the owner of Light Account
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY as Hex;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const owner = LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY);

// Create a provider to send user operations from your smart account
const provider = new AlchemyProvider({
  // get your Alchemy API key at https://dashboard.alchemy.com
  apiKey: ALCHEMY_API_KEY,
  chain,
}).connect(
  (rpcClient) =>
    new LightSmartContractAccount({
      rpcClient,
      owner,
      chain,
      factoryAddress: getDefaultLightAccountFactoryAddress(chain),
    })
);

(async () => {
  // Fund your account address with ETH to send for the user operations
  // (e.g. Get Sepolia ETH at https://sepoliafaucet.com)
  console.log("Smart Account Address: ", await provider.getAddress()); // Log the smart account address

  const user2 = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as Address;
  const { hash: uoHash } = await provider.sendUserOperation({
    target: user2,
    data: "0x",
    value: 0n,
  });

  console.log("User operation hash: ", uoHash);

  const txHash = await provider.waitForUserOperationTransaction(uoHash);

  console.log("Transaction hash: ", txHash);
})();
