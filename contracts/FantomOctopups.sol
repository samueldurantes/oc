// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FantomOctopups is ERC721, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _idCounter;

  address payable public depositAddress = payable(0xf778fF2Cd70bdB0346b080df378EF32bEe648D49);
  uint256 public maxMintable = 100;

  constructor() ERC721("FantomOctopups", "OCTO") {}

  function _baseURI() internal pure override returns (string memory) {
    return "";
  }

  function setDepositAddress(address payable to) public onlyOwner {
    depositAddress = to;
  }

  function claim(uint256 quantity) public payable {
    uint256 id = _idCounter.current();
    uint256 price = 1.5 ether * quantity;

    require(msg.value >= price, "Invalid amount!");
    require(id < maxMintable, "All Octopups have been minted!");

    depositAddress.transfer(price);
    
    for (uint256 i = 0; i < quantity; i++) {
      require(_idCounter.current() < maxMintable, "All Octopups have been minted!");

      _safeMint(msg.sender, _idCounter.current());
      _idCounter.increment();
    }
  }
}
