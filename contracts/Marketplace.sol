pragma solidity ^0.4.23;

import "./BotOwnership.sol";

contract Marketplace is BotOwnership {
  // maps the tokenId to the price
  mapping(uint256 => uint256) tokenIdToPrice;

  // id, price, owner for bots (temp work around returning array of structs)
  uint256[] botIdsForSale;
  uint256[] botPrices;
  address[] botOwners;

  /// @notice Add a Bot to the marketplace
  /// @param _tokenId The ID of the Bot to be sold
  /// @param _price Price you're selling the bot for
  /// @param _owner Address of the current owner of the bot
  function addBotToMarketPlace(uint256 _tokenId, uint256 _price, address _owner) public payable {
    approve(msg.sender, _tokenId);
    tokenIdToPrice[_tokenId] = _price;

    botIdsForSale.push(_tokenId);
    botPrices.push(_price);
    botOwners.push(_owner);
  }


  /// @notice Buy a bot from the marketplace
  /// @param _tokenId The ID of the Bot to be bought
  /// @param _owner Address of the current owner of the bot
  function buyBotFromMarketplace(uint256 _tokenId, address _owner) public payable {
    transferFrom(_owner, msg.sender, _tokenId);
    removeBotFromMarketplace(_tokenId);
  }

  // this is insane don't ever actually do this, ever
  function removeBotFromMarketplace(uint256 _tokenId) public returns(bool) {
    uint256 arrayLength = botIdsForSale.length;
    require(_tokenId <= arrayLength);
    uint i = _tokenId;

    for (; i < arrayLength - 1; i++) {
      botIdsForSale[i] = botIdsForSale[i + 1];
    }
    delete botIdsForSale[arrayLength - 1];
    botIdsForSale.length--;

    for (; i < arrayLength - 1; i++) {
      botPrices[i] = botPrices[i + 1];
    }
    delete botPrices[arrayLength - 1];
    botPrices.length--;

    for (; i < arrayLength - 1; i++) {
      botOwners[i] = botOwners[i + 1];
    }
    delete botOwners[arrayLength - 1];
    botOwners.length--;

    tokenIdToPrice[_tokenId] = 0;

    return true;
  }

  /// @notice Returns an array of ids of the bots for sale
  function listBotIds() public view returns (uint256[]) {
    return botIdsForSale;
  }

  /// @notice Returns an array of prices of the bots for sale
  function listBotPrices() public view returns (uint256[]) {
    return botPrices;
  }

  /// @notice Returns an array of address of the bots for sale
  function listBotOwners() public view returns (address[]) {
    return botOwners;
  }
}
