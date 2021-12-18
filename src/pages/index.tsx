import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import Web3 from 'web3'

const Home: NextPage = () => {
  const [wallet, setWallet] = useState(null)
  const [value, setValue] = useState(1)

  const handleConnectWallet = () => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      window.ethereum.enable()

      setWallet(window.ethereum.selectedAddress)
    } else {
      window.alert('Please install Metamask!')
    }
  }

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(event.target.value))
  }

  return (
    <div>
      {wallet ? (
        <div className='h-screen flex items-center flex-col mt-10'>
          <h1 className='mb-4 text-3xl text-center'>Currently were already minted 0 Fantom Octopup</h1>
          <h2 className='mt-6 mb-4 text-2xl'>{`${value} Octopup = ${value} Fantom`}</h2>
          <input
            className='bg-white focus:outline-none border border-gray-300 rounded-lg py-2 px-4'
            onChange={changeValue}
            type='number'
            value={value}
            min={1}
          />
          <button
            className='bg-white focus:outline-none border border-gray-300 rounded-md py-2 px-4 mt-4'
            type='submit'
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
