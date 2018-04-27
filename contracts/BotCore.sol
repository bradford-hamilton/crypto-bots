pragma solidity ^0.4.23;

import "./Ownable.sol";
import "./BotBase.sol";
import "./BotOwnership.sol";

contract BotCore is BotBase, BotOwnership, Ownable {
  /// @notice Creates the main CryptoBots smart contract instance.
  constructor() public {
    // start with 5 bots owned by me for sale
    _createBot(uint256(keccak256("Genesis Bot")), msg.sender);
    _createBot(uint256(keccak256("Another Bot")), msg.sender);
    _createBot(uint256(keccak256("IM A BOT")), msg.sender);
    _createBot(uint256(keccak256("Alex James is a person")), msg.sender);
    _createBot(uint256(keccak256("Does anyone know what was in that danish?")), msg.sender);
  }

  // do I need this?
  function() external payable {}
}
