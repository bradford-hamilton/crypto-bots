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

  // maps the tokenId to the price
  mapping(uint256 => uint256) tokenIdToPrice;

  // Array of bots for sale
  BotForSale[] botsForSale;

  // id, price, owner for bots (temp work around returning array of structs)
  uint256[] botIdsForSale;
  uint256[] botPrices;
  address[] botOwners;

  /// @notice Add a Bot to the marketplace
  /// @param _tokenId The ID of the Bot to be sold
  /// @param _price Price you're selling the bot for
  /// @param _owner Address of the current owner of the bot
  function addBotToMarketPlace(uint256 _tokenId, uint256 _price, address _owner) public {
    approve(msg.sender, _tokenId);
    tokenIdToPrice[_tokenId] = _price;
    botsForSale.push(BotForSale(_tokenId, _price, _owner));
    botIdsForSale.push(_tokenId);
    botPrices.push(_price);
    botOwners.push(_owner);
  }


  /// @notice Buy a bot from the marketplace
  /// @param _tokenId The ID of the Bot to be bought
  /// @param _owner Address of the current owner of the bot
  function buyBotFromMarketplace(uint256 _tokenId, address _owner) public payable {
    require(msg.value == tokenIdToPrice[_tokenId]);

    transferFrom(_owner, msg.sender, _tokenId);
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
