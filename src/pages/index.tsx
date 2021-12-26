import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import * as ethers from 'ethers'

import contract from '../../artifacts/contracts/FantomOctopups.sol/FantomOctopups.json'

const Home: NextPage = () => {
  const [provider, setProvider] = useState<ethers.ethers.providers.Web3Provider | undefined>(undefined)
  const [value, setValue] = useState(1)

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      window.alert('Please install Metamask!')
      return
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' })
    setProvider(new ethers.providers.Web3Provider(window.ethereum))
  }

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(event.target.value))
  }

  const handleMint = async () => {
    try {
      const signer = provider?.getSigner()
      const Contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS as string,
        contract.abi, 
        signer
      )

      console.log('Initialize payment')
      const txn = await Contract.claim(value, {
        value: ethers.utils.parseEther((1.5 * value).toString())
      })

      console.log('Minting... please wait')
      await txn.wait()

      console.log(txn.hash)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {provider ? (
        // TODO: Add a background
        <div className='h-screen flex items-center flex-col mt-10'>
          <h1 className='mb-4 text-3xl text-center'>Currently were already minted 0 Fantom Octopup</h1>
          <h2 className='mt-6 mb-4 text-2xl'>{`${value} Octopup = ${value * 1.5}`} FTM</h2>
          <input
            className='bg-white focus:outline-none border border-gray-300 rounded-lg py-2 px-4'
            onChange={changeValue}
            type='number'
            value={value}
            min={1}
          />
          <button
            className='bg-white focus:outline-none border border-gray-300 rounded-md py-2 px-4 mt-4'
            onClick={handleMint}
          >
            {`Mint ${value} now!`}
          </button>

          <div className='mt-12'>
            <h1 className='mb-4 text-4xl text-center'>Your Octupups:</h1>
            <div className='grid grid-cols-1 md:grid-cols-3 mt-6'>
            </div>
          </div>
        </div>
      ) : (
        // TODO: Add a introduction
        <div className='h-screen flex items-center justify-center flex-col'>
          <button
            className='mt-9 font-semibold leading-none text-white py-4 px-10 bg-blue-700 rounded hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 focus:outline-none'
            onClick={handleConnectWallet}
          >
            Connect with Metamask
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
