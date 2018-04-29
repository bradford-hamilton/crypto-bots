pragma solidity ^0.4.23;

import "./BotOwnership.sol";

contract Marketplace is BotOwnership {
  /// @dev Each bot for sale
  struct BotForSale {
    // bot index
    uint256 botId;
    // Price of bot
    uint256 price;
    // Owner's address
    address owner;
  }

  mapping(uint256 => uint256) tokenIdToPrice;

  BotForSale[] botsForSale;
  uint256[] botIdsForSale;
  uint256[] botPrices;
  address[] botOwners;

  function addBotToMarketPlace(uint256 _tokenId, uint256 _price, address _ownerAddress) public {
    approve(_ownerAddress, _tokenId);
    tokenIdToPrice[_tokenId] = _price;
    botsForSale.push(BotForSale(_tokenId, _price, _ownerAddress));
    botIdsForSale.push(_tokenId);
    botPrices.push(_price);
    botOwners.push(_ownerAddress);
  }

  function buyBotFromMarketplace(uint256 _tokenId, address _owner) public payable {
    require(msg.value == tokenIdToPrice[_tokenId]);

    transferFrom(_owner, msg.sender, _tokenId);
  }

  function listBotIds() public view returns (uint256[]) {
    return botIdsForSale;
  }

  function listBotPrices() public view returns (uint256[]) {
    return botPrices;
  }

  function listBotOwners() public view returns (address[]) {
    return botOwners;
  }
}
