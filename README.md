# Main Tutorial

## Tutorial: Querying a GraphQL API in React using fetch

### Introduction
In this tutorial, we'll focus on querying a GraphQL API using React and Next.js. We'll use the `fetch` API to send a GraphQL query to the API endpoint and display the fetched data in a React component.

### Prerequisites
- Basic understanding of React and Next.js
- Node.js and npm installed on your machine
- Access to a GraphQL API endpoint (replace `GraphURL` with your actual GraphQL API endpoint)

### Step 1: Set Up the Project
1. Create a new Next.js project or use an existing one.
2. Install the necessary packages:
   ```bash
   npm install react
   ```
3. Create a `utils` folder and a `auctions.js` file inside it to store your GraphQL API URL:
   ```javascript
   // utils/auctions.js
   export const GraphURL = "YOUR_GRAPHQL_API_ENDPOINT";
   ```

### Step 2: Write the Query Component
Create a new React component to handle the GraphQL query:

```javascript
// components/QueryComponent.js
import React, { useState, useEffect } from 'react';
import { GraphURL } from '../utils/auctions';

const QueryComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const query = `{
        auctionCreateds {
          auctionId
          seller
          stablecoin
          tokenId
          tokenContract
          endTime
          startTime
          startPrice
          blockTimestamp
          transactionHash
        }
      }`;

      const res = await fetch(GraphURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
      }).catch(error => console.error('Error:', error));

      const result = await res.json();
      setData(result?.data?.auctionCreateds);
    }

    fetchData();
  }, []);

  return (
    <div>
      {data ? (
        <ul>
          {data.map(auction => (
            <li key={auction.auctionId}>{auction.seller}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QueryComponent;
```

### Step 3: Implement the Query Component
Use the `QueryComponent` in your main React component or page:

```javascript
// pages/index.js
import React from 'react';
import QueryComponent from '../components/QueryComponent';

const Home = () => {
  return (
    <div>
      <h1>GraphQL Query Example</h1>
      <QueryComponent />
    </div>
  );
};

export default Home;
```

### Step 4: GraphQL Query Explanation
The GraphQL query used in the `QueryComponent` is structured to retrieve specific fields related to auction events from the GraphQL API. Here's a breakdown of the query and what each part does:

```graphql
{
  auctionCreateds {
    auctionId
    seller
    stablecoin
    tokenId
    tokenContract
    endTime
    startTime
    startPrice
    blockTimestamp
    transactionHash
  }
}
```

- **`auctionCreateds`**: This is the name of the GraphQL query field. It represents the entry point for fetching auction-related data. The name `auctionCreateds` is specific to the GraphQL schema of your API and may vary based on the schema design.

- **Selection Set (Fields)**: Within the `auctionCreateds` field, we specify a selection set of fields that we want to retrieve for each auction event. Here's what each field represents:

  - **`auctionId`**: The unique identifier for each auction.
  - **`seller`**: The seller or owner of the auction.
  - **`stablecoin`**: The stablecoin used in the auction.
  - **`tokenId`**: The token ID associated with the auction.
  - **`tokenContract`**: The contract address of the token.
  - **`endTime`**: The end time of the auction.
  - **`startTime`**: The start time of the auction.
  - **`startPrice`**: The starting price of the auction.
  - **`blockTimestamp`**: The timestamp of the block when the auction was created.
  - **`transactionHash`**: The transaction hash associated with the auction creation.

By specifying these fields in the GraphQL query, we instruct the API to return data for each auction event, including all the specified fields. This allows us to fetch detailed information about auction events from the API.

### Query Execution

When the `QueryComponent` is mounted in a React component, the `useEffect` hook triggers the execution of the GraphQL query using the `fetch` API. The query is sent as a POST request to the GraphQL API endpoint (`GraphURL`), with the query string JSON-encoded in the request body.

Upon receiving the JSON response from the API, the response data is parsed, and the relevant auction event data (`auctionCreateds`) is extracted. This data is then set as the component's state (`data`) using the `setData` function, making it available for rendering in the component's UI.

### Conclusion

The GraphQL query structure and execution process in the `QueryComponent` enable dynamic fetching of auction event data from a GraphQL API. By understanding the components of the query and how it interacts with the API, developers can effectively utilize GraphQL for data retrieval in React applications.



---

Feel free to customize the code or add more features based on your project requirements. If you have any further questions or need clarifications, please let me know!

## Overview Of the example project

Welcome to the Dauctions! This decentralized application (DApp) is designed to provide a seamless and secure platform for conducting online auctions using blockchain technology. Users can create, bid on, and manage auctions for various items or services, all while benefiting from the transparency and immutability of the Ethereum blockchain.

## Features

1. **Auction Creation**: Users can easily create new auctions, specifying essential details such as the item's name, description, starting price, reserve price, auction duration, and more.

2. **Bidding**: Participants can place bids on ongoing auctions, with the highest bidder winning the auction when the timer expires.

3. **Automatic Escrow**: When a user wins an auction, the winning bid amount is held in escrow until the auction concludes, ensuring fairness in the process.

7. **Wallet Integration**: The DApp integrates with users' Ethereum wallets for easy and secure transactions.

8. **Search and Filter**: Users can search for specific auctions or filter auctions based on criteria like category, price range, and auction status.


## Smart Contracts

The core functionality of this DApp is powered by Ethereum smart contracts. The smart contracts are deployed on the Ethereum blockchain and are responsible for managing auctions, bids, and escrow. You can find the smart contract code in the `contracts/` directory.

https://docs.google.com/presentation/d/1jW9E35lPPcsXYpgqC8xFGVPpZX-bWfH0Ot5o3MQ7f-k/edit#slide=id.p5



# Usage

# 🏗 Scaffold-ETH 2

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

## Contents

- [Requirements](#requirements)
- [Quickstart](#quickstart)
- [Deploying your Smart Contracts to a Live Network](#deploying-your-smart-contracts-to-a-live-network)
- [Deploying your NextJS App](#deploying-your-nextjs-app)
- [Interacting with your Smart Contracts: SE-2 Custom Hooks](#interacting-with-your-smart-contracts-se-2-custom-hooks)
- [Disabling Type & Linting Error Checks](#disabling-type-and-linting-error-checks)
  - [Disabling commit checks](#disabling-commit-checks)
  - [Deploying to Vercel without any checks](#deploying-to-vercel-without-any-checks)
  - [Disabling Github Workflow](#disabling-github-workflow)
- [Contributing to Scaffold-ETH 2](#contributing-to-scaffold-eth-2)

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the contract component or the example ui in the frontend. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Deploying your Smart Contracts to a Live Network

Once you are ready to deploy your smart contracts, there are a few things you need to adjust.

1. Select the network

By default, `yarn deploy` will deploy the contract to the local network. You can change the defaultNetwork in `packages/hardhat/hardhat.config.ts.` You could also simply run `yarn deploy --network target_network` to deploy to another network.

Check the `hardhat.config.ts` for the networks that are pre-configured. You can also add other network settings to the `hardhat.config.ts file`. Here are the [Alchemy docs](https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask) for information on specific networks.

Example: To deploy the contract to the Sepolia network, run the command below:

```
yarn deploy --network sepolia
```

2. Generate a new account or add one to deploy the contract(s) from. Additionally you will need to add your Alchemy API key. Rename `.env.example` to `.env` and fill the required keys.

```
ALCHEMY_API_KEY="",
DEPLOYER_PRIVATE_KEY=""
```

The deployer account is the account that will deploy your contracts. Additionally, the deployer account will be used to execute any function calls that are part of your deployment script.

You can generate a random account / private key with `yarn generate` or add the private key of your crypto wallet. `yarn generate` will create a random account and add the DEPLOYER_PRIVATE_KEY to the .env file. You can check the generated account with `yarn account`.

3. Deploy your smart contract(s)

Run the command below to deploy the smart contract to the target network. Make sure to have some funds in your deployer account to pay for the transaction.

```
yarn deploy --network network_name
```

4. Verify your smart contract

You can verify your smart contract on Etherscan by running:

```
yarn verify --network network_name
```

## Deploying your NextJS App

**Hint**: We recommend connecting your GitHub repo to Vercel (through the Vercel UI) so it gets automatically deployed when pushing to `main`.

If you want to deploy directly from the CLI, run `yarn vercel` and follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

**Make sure your `packages/nextjs/scaffold.config.ts` file has the values you need.**

## Interacting with your Smart Contracts: SE-2 Custom Hooks

Scaffold-ETH 2 provides a collection of custom React hooks designed to simplify interactions with your deployed smart contracts. These hooks are wrappers around `wagmi`, automatically loading the necessary contract ABI and address. They offer an easy-to-use interface for reading from, writing to, and monitoring events emitted by your smart contracts.

To help developers get started with smart contract interaction using Scaffold-ETH 2, we've provided the following custom hooks:

- [useScaffoldContractRead](#usescaffoldcontractread): for reading public variables and getting data from read-only functions of your contract.
- [useScaffoldContractWrite](#usescaffoldcontractwrite): for sending transactions to your contract to write data or perform an action.
- [useScaffoldEventSubscriber](#usescaffoldeventsubscriber): for subscribing to your contract events and receiving real-time updates when events are emitted.
- [useScaffoldEventHistory](#usescaffoldeventhistory): for retrieving historical event logs for your contract, providing past activity data.
- [useDeployedContractInfo](#usedeployedcontractinfo): for fetching details from your contract, including the ABI and address.
- [useScaffoldContract](#usescaffoldcontract): for obtaining a contract instance that lets you interact with the methods of your deployed smart contract.

These hooks offer a simplified and streamlined interface for interacting with your smart contracts. If you need to interact with external contracts, you can use `wagmi` directly, or add external contract data to your `deployedContracts.ts` file.

### useScaffoldContractRead:

Use this hook to read public variables and get data from read-only functions of your smart contract.

```ts
const { data: totalCounter } = useScaffoldContractRead({
  contractName: "YourContract",
  functionName: "getGreeting",
  args: ["ARGUMENTS IF THE FUNCTION ACCEPTS ANY"],
});
```

This example retrieves the data returned by the `getGreeting` function of the `YourContract` smart contract. If the function accepts any arguments, they can be passed in the args array. The retrieved data is stored in the `data` property of the returned object.

### useScaffoldContractWrite:

Use this hook to send a transaction to your smart contract to write data or perform an action.

```ts
const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
  contractName: "YourContract",
  functionName: "setGreeting",
  args: ["The value to set"],
  // For payable functions, expressed in ETH
  value: "0.01",
  // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
  blockConfirmations: 1,
  // The callback function to execute when the transaction is confirmed.
  onBlockConfirmation: (txnReceipt) => {
    console.log("Transaction blockHash", txnReceipt.blockHash);
  },
});
```

To send the transaction, you can call the `writeAsync` function returned by the hook. Here's an example usage:

```ts
<button className="btn btn-primary" onClick={writeAsync}>
  Send TX
</button>
```

This example sends a transaction to the `YourContract` smart contract to call the `setGreeting` function with the arguments passed in `args`. The `writeAsync` function sends the transaction to the smart contract, and the `isLoading` and `isMining` properties indicate whether the transaction is currently being processed by the network.

### useScaffoldEventSubscriber:

Use this hook to subscribe to events emitted by your smart contract, and receive real-time updates when these events are emitted.

```ts
useScaffoldEventSubscriber({
  contractName: "YourContract",
  eventName: "GreetingChange",
  // The listener function is called whenever a GreetingChange event is emitted by the contract.
  // It receives the parameters emitted by the event, for this example: GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
  listener: (greetingSetter, newGreeting, premium, value) => {
    console.log(greetingSetter, newGreeting, premium, value);
  },
});
```

This example subscribes to the `GreetingChange` event emitted by the `YourContract` smart contract, and logs the parameters emitted by the event to the console whenever it is emitted. The `listener` function accepts the parameters emitted by the event, and can be customized according to your needs.

### useScaffoldEventHistory:

Use this hook to retrieve historical event logs for your smart contract, providing past activity data.

```ts
const {
  data: events,
  isLoading: isLoadingEvents,
  error: errorReadingEvents,
  } = useScaffoldEventHistory({
  contractName: "YourContract",
  eventName: "GreetingChange",
  // Specify the starting block number from which to read events, this is a bigint.
  fromBlock: 31231n,
  blockData: true,
  // Apply filters to the event based on parameter names and values { [parameterName]: value },
  filters: { premium: true }
  // If set to true it will return the transaction data for each event (default: false),
  transactionData: true,
  // If set to true it will return the receipt data for each event (default: false),
  receiptData: true
});
```

This example retrieves the historical event logs for the `GreetingChange` event of the `YourContract` smart contract, starting from block number 31231 and filtering events where the premium parameter is true. The data property of the returned object contains an array of event objects, each containing the event parameters and (optionally) the block, transaction, and receipt data. The `isLoading` property indicates whether the event logs are currently being fetched, and the `error` property contains any error that occurred during the fetching process (if applicable).

### useDeployedContractInfo:

Use this hook to fetch details about a deployed smart contract, including the ABI and address.

```ts
// ContractName: name of the deployed contract
const { data: deployedContractData } = useDeployedContractInfo(contractName);
```

This example retrieves the details of the deployed contract with the specified name and stores the details in the deployedContractData object.

### useScaffoldContract:

Use this hook to get your contract instance by providing the contract name. It enables you interact with your contract methods.
For reading data or sending transactions, it's recommended to use `useScaffoldContractRead` and `useScaffoldContractWrite`.

```ts
const { data: yourContract } = useScaffoldContract({
  contractName: "YourContract",
});
// Returns the greeting and can be called in any function, unlike useScaffoldContractRead
await yourContract?.greeting();

// Used to write to a contract and can be called in any function
import { useWalletClient } from "wagmi";

const { data: walletClient } = useWalletClient();
const { data: yourContract } = useScaffoldContract({
  contractName: "YourContract",
  walletClient,
});
const setGreeting = async () => {
  // Call the method in any function
  await yourContract?.setGreeting("the greeting here");
};
```

This example uses the `useScaffoldContract` hook to obtain a contract instance for the `YourContract` smart contract. The data property of the returned object contains the contract instance that can be used to call any of the smart contract methods.

## Disabling type and linting error checks

> **Hint**
> Typescript helps you catch errors at compile time, which can save time and improve code quality, but can be challenging for those who are new to the language or who are used to the more dynamic nature of JavaScript. Below are the steps to disable type & lint check at different levels

### Disabling commit checks

We run `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) which lints the staged files and don't let you commit if there is an linting error.

To disable this, go to `.husky/pre-commit` file and comment out `yarn lint-staged --verbose`

```diff
- yarn lint-staged --verbose
+ # yarn lint-staged --verbose
```

### Deploying to Vercel without any checks

By default, Vercel runs types and lint checks before building your app. The deployment will fail if there are any types or lint errors.

To ignore these checks while deploying from the CLI, use:

```shell
yarn vercel:yolo
```

If your repo is connected to Vercel, you can set `NEXT_PUBLIC_IGNORE_BUILD_ERROR` to `true` in a [environment variable](https://vercel.com/docs/concepts/projects/environment-variables).

### Disabling Github Workflow

We have github workflow setup checkout `.github/workflows/lint.yaml` which runs types and lint error checks every time code is **pushed** to `main` branch or **pull request** is made to `main` branch

To disable it, **delete `.github` directory**

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
