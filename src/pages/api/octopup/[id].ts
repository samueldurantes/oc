// Credits: https://github.com/fakenickels/fantom-kittens

import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import * as ethers from 'ethers'

import _contract from '../../../../artifacts/contracts/FantomOctopups.sol/FantomOctopups.json'

const {
  NETWORK_RPC,
  NEXT_PUBLIC_CONTRACT_ADDRESS: CONTRACT_ADDRESS,
  METADATA_URL
} = process.env

const provider = new ethers.providers.JsonRpcProvider(NETWORK_RPC)
const contract = new ethers.Contract(
  CONTRACT_ADDRESS as string,
  _contract.abi,
  provider
)

interface Data {
  id: string
  name: string
  image: string
  description: string
  attributes: Array<{ trait_type: string; value: string }>
}

interface Error {
  message: string
}

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS']
})

function runMiddleware(request: any, response: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(request, response, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data | Error>
) {
  await runMiddleware(request, response, cors)
  const id = request.query.id as string

  try {
    console.log(await contract.ownerOf(id))
    const metadata = await fetch(`${METADATA_URL}/${id}.json`).then(
      (response) => response.json()
    )

    return response.status(200).json(metadata)
  } catch (_) {
    return response.status(404).json({ message: 'Not found' })
  }
}
