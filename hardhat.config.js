require('dotenv').config({ path: '.env.local' })
require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.4',
  networks: {
    fantom: {
      url: 'https://rpc.testnet.fantom.network/',
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
}
