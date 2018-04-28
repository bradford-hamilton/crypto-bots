pragma solidity ^0.4.23;

import "./Marketplace.sol";

contract BotCore is Marketplace {
  /// @notice Creates the main CryptoBots smart contract instance.
  constructor() public {
    // start with 5 bots owned by me for sale
    uint256 botOneId = _createBot(uint256(keccak256("Genesis Bot")), msg.sender);
    uint256 botTwoId = _createBot(uint256(keccak256("Another Bot")), msg.sender);
    uint256 botThreeId = _createBot(uint256(keccak256("IM A BOT")), msg.sender);
    uint256 botFourId = _createBot(uint256(keccak256("Alex James is a person")), msg.sender);
    uint256 botFiveId = _createBot(uint256(keccak256("Does anyone know what was in that danish?")), msg.sender);

    addBotToMarketPlace(botOneId, .01 ether);
    addBotToMarketPlace(botTwoId, .01 ether);
    addBotToMarketPlace(botThreeId, .01 ether);
    addBotToMarketPlace(botFourId, .01 ether);
    addBotToMarketPlace(botFiveId, .01 ether);
  }

  function() external payable {}
}
