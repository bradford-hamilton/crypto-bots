pragma solidity ^0.4.23;

contract BotBase {
  /// @dev The Birth event is fired whenever a new bot comes into existence.
  event Birth(address owner, uint256 botId, uint256 dna);

  /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a bot
  ///  ownership is assigned
  event Transfer(address from, address to, uint256 tokenId);

  /// @dev The main Bot struct
  struct Bot {
    // The Bot's dna is packed into these 256-bits
    uint256 dna;
    // The timestamp from the block when this bot came into existence.
    uint64 birthTime;
  }

  Bot[] bots;

  /// @dev A mapping from bot IDs to the address that owns them. All bots have
  ///  some valid owner address
  mapping (uint256 => address) public botIndexToOwner;

  // @dev A mapping from owner address to count of tokens that address owns.
  //  Used internally inside balanceOf() to resolve ownership count.
  mapping (address => uint256) ownershipTokenCount;

  /// @dev A mapping from BotIDs to an address that has been approved to call
  ///  transferFrom(). Each Bot can only have one approved address for transfer
  ///  at any time. A zero value means no approval is outstanding.
  mapping (uint256 => address) public botIndexToApproved;

  /// @dev Assigns ownership of a specific Bot to an address.
  function _transfer(address _from, address _to, uint256 _tokenId) internal {
    // Since the number of bots is capped to 2^32 we can't overflow this
    ownershipTokenCount[_to]++;
    // transfer ownership
    botIndexToOwner[_tokenId] = _to;
    // When creating new bots _from is 0x0, but we can't account that address.
    if (_from != address(0)) {
      ownershipTokenCount[_from]--;
      // clear any previously approved ownership exchange
      delete botIndexToApproved[_tokenId];
    }
    // Emit the transfer event.
    emit Transfer(_from, _to, _tokenId);
  }

  /// @dev An internal method that creates a new bot and stores it. Will generate
  ///  both a Birth & Transfer event
  /// @param _dna The bot's genetic code.
  /// @param _owner The inital owner of this bot
  function _createBot(
    uint256 _dna,
    address _owner
  )
    internal
    returns (uint)
  {
    Bot memory _bot = Bot({
      dna: _dna,
      birthTime: uint64(now)
    });

    uint256 newBotId = bots.push(_bot) - 1;

    // It's probably never going to happen, 4 billion bots is A LOT, but
    // let's just be 100% sure we never let this happen.
    require(newBotId == uint256(uint32(newBotId)));

    // emit the birth event
    emit Birth(_owner, newBotId, _bot.dna);

    // This will assign ownership, and also emit the Transfer event as
    // per ERC721 draft
    _transfer(0, _owner, newBotId);

    return newBotId;
  }
}
