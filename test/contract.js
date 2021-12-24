const { expect } = require('chai')

describe('Fantom Octopups contract', function () {
  let owner
  let depositAddress

  this.beforeAll(async () => {
    [owner, depositAddress, random] = await ethers.getSigners()
  })

  it('should minted a octopup', async function () {
    const initialBalance = await depositAddress.getBalance()
    const Contract = await ethers.getContractFactory('FantomOctopups')
    const contract = await Contract.deploy()

    await contract.setDepositAddress(await depositAddress.getAddress())

    await contract
      .connect(random)
      .claim(1, { value: ethers.utils.parseEther('1.5') })
        .catch((error) => console.log(error.message))

    expect(await depositAddress.getBalance()).to.equal(initialBalance.add(ethers.utils.parseEther('1.5')))
  })

  it('should not be minted because invalid amount', async function () {
    const Contract = await ethers.getContractFactory('FantomOctopups')
    const contract = await Contract.deploy()

    const receipt = await contract
      .connect(random)
      .claim(1, { value: ethers.utils.parseEther('1') })
        .catch((error) => error.message)

    expect(receipt).to.equal(`VM Exception while processing transaction: reverted with reason string 'Invalid amount!'`)
  })

  it('should not reserve octopups', async function () {
    const Contract = await ethers.getContractFactory('FantomOctopups')
    const contract = await Contract.deploy()

    const receipt = await contract
      .connect(random)
      .reserve(10)
        .catch((error) => error.message)

    expect(receipt).to.equal(`VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'`)
  })
})
