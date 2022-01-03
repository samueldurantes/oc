/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { ChangeEvent, useState, useRef, useEffect } from 'react'
import * as ethers from 'ethers'
import { toast } from 'react-toastify'

import Contract from '../../artifacts/contracts/FantomOctopups.sol/FantomOctopups.json'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string
const NETWORK_CHAINID = process.env.NEXT_PUBLIC_NETWORK_CHAINID as string

const Home: NextPage = () => {
  const [provider, setProvider] = useState<
    ethers.ethers.providers.Web3Provider | undefined
  >(undefined)
  const [value, setValue] = useState(1)
  const [userTokens, setUserTokens] = useState<string[]>([])
  const [supply, setSupply] = useState(0)
  const contract = useRef<ethers.ethers.Contract>()

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      window.alert('Please install Metamask!')
      return
    }

    if (window.ethereum.networkVersion != NETWORK_CHAINID) {
      window.alert('Please connect to Fantom Opera Network')
      return
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' })
    setProvider(new ethers.providers.Web3Provider(window.ethereum))
  }

  const getUserTokens = async () => {
    const tokens = []
    let index = 0
    const owner = window.ethereum.selectedAddress
    const balance = await contract.current?.balanceOf(owner)
    for (let i = 0; i < balance; i++) {
      const token = await contract.current?.tokenOfOwnerByIndex(owner, index)
      tokens.push(token.toString())
      index++
    }

    setUserTokens(tokens)
  }

  const getTotalSupply = async () => {
    const totalSupply = await contract.current?.totalSupply()

    setSupply(totalSupply)
  }

  useEffect(() => {
    if (provider) {
      contract.current = new ethers.Contract(
        CONTRACT_ADDRESS,
        Contract.abi,
        provider?.getSigner()
      )

      getUserTokens()
      setInterval(() => getTotalSupply(), 1000)
    }
  }, [provider])

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(Math.max(1, +event.target.value))
  }

  const handleMint = async () => {
    const claimPromise = new Promise((resolve, reject) => {
      contract.current
        ?.claim(value, {
          value: ethers.utils.parseEther((1.5 * value).toString())
        })
        .then((receipt: any) => {
          console.log(receipt)

          getUserTokens()

          resolve(receipt)
        })
        .catch((error: any) => {
          console.log(error)
          reject(error)
        })
    })

    toast.promise(claimPromise, {
      pending: 'Minting... please wait',
      success: {
        render: (_) => 'Claimed!'
      },
      error: {
        render: (_) => 'Something went wrong... Try again!'
      }
    })
  }

  return (
    <div>
      {provider ? (
        <div className="h-screen flex items-center flex-col">
          <h1 className="mb-4 text-3xl text-center mt-10">
            Currently has {100 - supply} Octopups to mint
          </h1>
          <h2 className="mt-6 mb-4 text-2xl">
            {`${value} Octopup = ${value * 1.5}`} FTM
          </h2>
          <input
            className="bg-white focus:outline-none border border-gray-300 rounded-lg py-2 px-4"
            onChange={changeValue}
            type="number"
            value={value}
            min={1}
          />
          <button
            className="bg-white focus:outline-none border border-gray-300 rounded-md py-2 px-4 mt-4"
            onClick={handleMint}
          >
            {`Mint ${value} now!`}
          </button>

          <div className="mt-12">
            <h1 className="mb-4 text-4xl text-center">Your Octupups:</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 mt-6">
              {userTokens.map((id) => (
                <div key={id}>
                  <LoadImage src={id} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center flex-col">
          <img className="w-96 h-96 mb-5" src="/octo.gif" alt="Octopups gif" />
          <h1 className="font-bold text-3xl text-center">
            Welcome to Fantom Octopups 🐙
          </h1>
          <p className="mt-6 md:w-1/3 text-center">
            Fantom Octopups is a NFT collection created on Fantom Network. Are
            100 Octopups randomly generated, each Octopup is unique and costs
            1.5 FTM. Join our{' '}
            <a
              className="text-blue-400 underline"
              href="https://discord.gg/N5sD6J5J8D"
            >
              discord server!
            </a>
          </p>
          <button
            className="mt-9 font-semibold leading-none text-white py-4 px-10 bg-blue-700 rounded hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 focus:outline-none"
            onClick={handleConnectWallet}
          >
            Connect with Metamask
          </button>
        </div>
      )}
    </div>
  )
}

function LoadImage({ src }: { src: string }) {
  const [image, setImage] = useState(null)

  useEffect(() => {
    fetch(`/api/octopup/${src}`)
      .then((response) => response.json())
      .then((metadata) => {
        const image = metadata.image?.replace(
          'ipfs://',
          'https://ipfs.io/ipfs/'
        )

        setImage(image)
      })
  })

  if (!image) return <></>

  return (
    <img
      className="h-64 w-64 pb-4 md:pr-4"
      key={image}
      src={image}
      alt={image}
    />
  )
}

export default Home
