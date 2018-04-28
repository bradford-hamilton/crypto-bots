pragma solidity ^0.4.23;

import "./BotOwnership.sol";

contract Marketplace is BotOwnership {
  mapping(uint256 => uint256) tokenIdToPrice;

  uint256[] botIdsForSale;

  function addBotToMarketPlace(uint256 _tokenId, uint256 _price) public {
    approve(this, _tokenId);
    tokenIdToPrice[_tokenId] = _price;
    botIdsForSale.push(_tokenId);
  }

  function buyBotFromMarketplace(uint256 _tokenId, address _owner) public payable {
    require(msg.value == tokenIdToPrice[_tokenId]);

    transferFrom(_owner, msg.sender, _tokenId);
  }

  function listBotIdsForSale() public view returns (uint256[]) {
    return botIdsForSale;
  }
}
