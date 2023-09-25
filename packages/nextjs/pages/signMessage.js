import * as React from 'react'
import { useAccount, useSignMessage, useWalletClient } from 'wagmi'
import { recoverMessageAddress, } from 'viem'
import { useScaffoldContract } from '../hooks/scaffold-eth/useScaffoldContract'
import { AbiCoder, ethers } from 'ethers'

 
export default function SignMessage() {
  const [recoveredAddress, setRecoveredAddress] = React.useState()
  const { data, error, isLoading, signMessage, variables } = useSignMessage()
  const account = useAccount();
  const {data: walletClient} = useWalletClient();
  const {data: auction} = useScaffoldContract({
    contractName: "Auction",
    walletClient
  });
 
  React.useEffect(() => {
    (async () => {
      if (variables?.message && data) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: data,
        })
        setRecoveredAddress(recoveredAddress)


        console.log('sig', data, 'recoveredAddress', recoveredAddress, variables)
      }
    })()
  }, [data, variables?.message])

//   const metaTx = {
//     from: account.address,
//     to: "0xf8e059791647851A0Ff07b535399436Ee0683aC4",
//     data: auction.data.[functionName](...functionParams).encodeABI(),
//     gas: 'GasLimit',
//     gasPrice: 'GasPrice',
//     nonce: 'YourNonce', // Get the nonce from the sender's account
// };
 
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const message = formData.get('message');
        console.log(message);
        const b = new AbiCoder()
        const param1 = "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C";
        const param2 = 123;
        const param3 = "coffee and donuts"
        const param4 = 1
        const messageHash = "0xcf36ac4f97dc10d91fc2cbb20d718e94a8cbfe0f82eaedc6a4aa38946fb797cd";

        console.log('hash', messageHash);

        signMessage({ message: messageHash });
        
      }}
    >
      <label htmlFor="message">Enter a message to sign</label>
      <textarea
        id="message"
        name="message"
        placeholder="The quick brown fox…"
      />
      <button disabled={isLoading}>
        {isLoading ? 'Check Wallet' : 'Sign Message'}
      </button>
 
      {data && (
        <div>
          <div>Recovered Address: {recoveredAddress}</div>
          <div>Signature: {data}</div>

        </div>
      )}
 
      {error && <div>{error.message}</div>}
    </form>
  )
}