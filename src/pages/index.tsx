import type { NextPage } from 'next'
import { useState } from 'react'
import Web3 from 'web3'

const Home: NextPage = () => {
  const [wallet, setWallet] = useState(null)

  const handleConnectWallet = () => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      window.ethereum.enable()

      setWallet(window.ethereum.selectedAddress)
    } else {
      window.alert('Please install Metamask!')
    }
  }

  return (
    <div className='h-screen flex items-center justify-center flex-col'>
      {wallet ? (
        <p>{`Your address: ${wallet}`}</p>
      ) : (
        <button
          className='mt-9 font-semibold leading-none text-white py-4 px-10 bg-blue-700 rounded hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 focus:outline-none'
          onClick={handleConnectWallet}
        >
          Connect with Metamask
        </button>
      )}
    </div>
  )
}

export default Home
